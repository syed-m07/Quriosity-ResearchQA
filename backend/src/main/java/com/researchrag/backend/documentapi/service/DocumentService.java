package com.researchrag.backend.documentapi.service;

import com.researchrag.backend.documentapi.dto.DocumentMetadataDto;
import com.researchrag.backend.documentapi.dto.PythonUploadResponse;
import com.researchrag.backend.documentapi.dto.QueryRequest;
import com.researchrag.backend.documentapi.dto.QueryResponse;
import com.researchrag.backend.documentapi.dto.PythonQueryRequest;
import com.researchrag.backend.documentapi.model.Document;
import com.researchrag.backend.documentapi.model.DocumentStatus;
import com.researchrag.backend.documentapi.repo.DocumentRepository;
import com.researchrag.backend.userapi.user.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.web.reactive.function.BodyInserters;

import java.io.IOException;
import java.time.LocalDateTime;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.concurrent.TimeUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);

    private final DocumentRepository documentRepository;
    private final WebClient.Builder webClientBuilder;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final long CACHE_TTL_SECONDS = 300; // 5 minutes

    @Value("${rag.service.base-url}")
    private String ragServiceBaseUrl;

    public List<DocumentMetadataDto> getAllDocuments(User user) {
        List<Document> documents = documentRepository.findByUser(user);
        return documents.stream()
                .map(doc -> DocumentMetadataDto.builder()
                        .id(doc.getId())
                        .fileName(doc.getFileName())
                        .uploadDate(doc.getUploadDate())
                        .status(doc.getStatus())
                        .pythonDocumentId(doc.getPythonDocumentId())
                        .build())
                .collect(Collectors.toList());
    }

    public DocumentMetadataDto uploadAndProcessDocument(MultipartFile file, User user) throws IOException {
        Document document = Document.builder()
                .fileName(file.getOriginalFilename())
                .contentType(file.getContentType())
                .size(file.getSize())
                .uploadDate(LocalDateTime.now())
                .status(DocumentStatus.UPLOADING)
                .user(user)
                .build();
        final Document savedDocument = documentRepository.save(document);

        // Simulate sending to Python RAG service
        // In a real scenario, you would send the file content here
        // For now, we'll just update the status after a simulated call
        WebClient webClient = webClientBuilder.baseUrl(ragServiceBaseUrl).build();

        // Prepare multipart form data
        MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();
        bodyBuilder.part("file", file.getBytes()).filename(file.getOriginalFilename()); // Assuming Python expects a field named 'file'

        PythonUploadResponse pythonResponse = null;
        try {
            pythonResponse = webClient.post()
                    .uri("/upload")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(bodyBuilder.build()))
                    .retrieve()
                    .bodyToMono(PythonUploadResponse.class)
                    .block(); // This is the blocking call
        } catch (Exception e) { // Catch a general Exception for now to see what's happening
            logger.error("Failed to communicate with Python RAG service during upload: " + e.getMessage(), e);
            savedDocument.setStatus(DocumentStatus.FAILED);
            documentRepository.save(savedDocument);
            throw new RuntimeException("Failed to process document with RAG service.", e);
        }

        if (pythonResponse != null && pythonResponse.getDocument_id() != null) {
            savedDocument.setStatus(DocumentStatus.COMPLETED);
            savedDocument.setPythonDocumentId(pythonResponse.getDocument_id());
            documentRepository.save(savedDocument);
        } else {
            savedDocument.setStatus(DocumentStatus.FAILED);
            documentRepository.save(savedDocument);
            throw new RuntimeException("Failed to get document_id from Python RAG service.");
        }

        return DocumentMetadataDto.builder()
                .id(savedDocument.getId())
                .fileName(savedDocument.getFileName())
                .uploadDate(savedDocument.getUploadDate())
                .status(savedDocument.getStatus())
                .pythonDocumentId(savedDocument.getPythonDocumentId()) // Now this should be populated
                .build();
    }

    public QueryResponse queryDocuments(QueryRequest queryRequest, User user) {
        String cacheKey = generateCacheKey(queryRequest.getDocumentId(), queryRequest.getQuestion());

        // Try to retrieve from cache
        String cachedResponse = redisTemplate.opsForValue().get(cacheKey);
        if (cachedResponse != null) {
            try {
                logger.info("Cache hit for query: {}", cacheKey);
                return objectMapper.readValue(cachedResponse, QueryResponse.class);
            } catch (JsonProcessingException e) {
                logger.error("Error deserializing cached response for key {}: {}", cacheKey, e.getMessage());
                // Fall through to actual service call if deserialization fails
            }
        }

        // Retrieve the Document entity to get the Python-generated documentId
        Document document = documentRepository.findById(queryRequest.getDocumentId())
                .orElseThrow(() -> new RuntimeException("Document not found with ID: " + queryRequest.getDocumentId()));

        // Create a new QueryRequest for the Python service with the correct document_id
        PythonQueryRequest pythonQueryRequest = PythonQueryRequest.builder()
                .question(queryRequest.getQuestion())
                .document_id(document.getPythonDocumentId())
                .build();

        WebClient webClient = webClientBuilder.baseUrl(ragServiceBaseUrl).build();
        Mono<QueryResponse> responseMono = webClient.post()
                .uri("/ask") // Assuming /ask is the query endpoint
                .bodyValue(pythonQueryRequest)
                .retrieve()
                .bodyToMono(QueryResponse.class)
                .doOnError(error -> {
                    logger.error("Error querying RAG service: " + error.getMessage(), error);
                });

        QueryResponse queryResponse = responseMono.block(); // Block for testing/simplicity, in a real app consider reactive flow

        // Cache the response
        if (queryResponse != null) {
            try {
                String jsonResponse = objectMapper.writeValueAsString(queryResponse);
                redisTemplate.opsForValue().set(cacheKey, jsonResponse, CACHE_TTL_SECONDS, TimeUnit.SECONDS);
                logger.info("Cached response for query: {}", cacheKey);
            } catch (JsonProcessingException e) {
                logger.error("Error serializing response for caching for key {}: {}", cacheKey, e.getMessage());
            }
        }
        return queryResponse;
    }

    private String generateCacheKey(Long documentId, String question) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(question.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return "query:" + documentId + ":" + hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            logger.error("SHA-256 algorithm not found, falling back to simple key generation", e);
            return "query:" + documentId + ":" + question.hashCode(); // Fallback
        }
    }
}
