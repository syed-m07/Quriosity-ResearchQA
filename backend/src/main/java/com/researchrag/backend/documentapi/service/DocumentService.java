package com.researchrag.backend.documentapi.service;

import com.researchrag.backend.documentapi.dto.*;
import com.researchrag.backend.documentapi.model.Document;
import com.researchrag.backend.documentapi.model.DocumentStatus;
import com.researchrag.backend.documentapi.repo.DocumentRepository;
import com.researchrag.backend.qaapi.repo.QaInteractionRepository;
import com.researchrag.backend.userapi.user.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);
    private static final String UPLOAD_DIR = "backend/temp-uploads/";
    public static final String PROCESSING_QUEUE = "doc-processing-queue";

    private final DocumentRepository documentRepository;
    private final QaInteractionRepository qaInteractionRepository;
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
        // 1. Save file to a temporary local directory
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
        String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR + uniqueFileName);
        Files.copy(file.getInputStream(), filePath);

        // 2. Create a document record in the database with PROCESSING status
        Document document = Document.builder()
                .fileName(file.getOriginalFilename())
                .storageFileName(uniqueFileName)
                .contentType(file.getContentType())
                .size(file.getSize())
                .uploadDate(LocalDateTime.now())
                .status(DocumentStatus.PROCESSING) // Set status to PROCESSING
                .user(user)
                .build();
        final Document savedDocument = documentRepository.save(document);

        // 3. Create a job payload and push it to the Redis queue
        try {
            ProcessingJobDto job = new ProcessingJobDto(savedDocument.getId(), filePath.toAbsolutePath().toString());
            String jobJson = objectMapper.writeValueAsString(job);
            redisTemplate.opsForList().leftPush(PROCESSING_QUEUE, jobJson);
            logger.info("Enqueued document {} for processing.", savedDocument.getId());
        } catch (JsonProcessingException e) {
            logger.error("Failed to serialize processing job for document id: {}", savedDocument.getId(), e);
            // If queuing fails, mark document as FAILED
            savedDocument.setStatus(DocumentStatus.FAILED);
            documentRepository.save(savedDocument);
            // Clean up the saved file
            Files.delete(filePath);
            throw new RuntimeException("Could not enqueue document for processing.", e);
        }

        // 4. Return immediately to the user
        return DocumentMetadataDto.builder()
                .id(savedDocument.getId())
                .fileName(savedDocument.getFileName())
                .uploadDate(savedDocument.getUploadDate())
                .status(savedDocument.getStatus())
                .build();
    }

    public void updateDocumentStatus(Long documentId, DocumentStatus status, String pythonDocumentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found with ID: " + documentId));

        document.setStatus(status);
        if (pythonDocumentId != null) {
            document.setPythonDocumentId(pythonDocumentId);
        }
        documentRepository.save(document);
        logger.info("Updated status for document {} to {}", documentId, status);
    }

    @Transactional
    public void deleteDocument(Long documentId, User user) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found with ID: " + documentId));

        if (!document.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to delete this document.");
        }

        // Delete associated Q&A history
        qaInteractionRepository.deleteByDocumentId(documentId);

        // Delete from Python RAG service
        if (document.getPythonDocumentId() != null && !document.getPythonDocumentId().isBlank()) {
            try {
                webClientBuilder.baseUrl(ragServiceBaseUrl).build().delete()
                        .uri("/documents/" + document.getPythonDocumentId())
                        .retrieve()
                        .toBodilessEntity()
                        .block(); // Consider making this async in a real-world scenario
                logger.info("Successfully deleted document {} from RAG service.", document.getPythonDocumentId());
            } catch (Exception e) {
                logger.error("Failed to delete document {} from RAG service. This might require manual cleanup.", document.getPythonDocumentId(), e);
            }
        }

        // Delete the physical file
        try {
            Path filePath = Paths.get(UPLOAD_DIR + document.getStorageFileName());
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
        } catch (IOException e) {
            logger.error("Failed to delete physical file for document id: {}", documentId, e);
            // Decide if you want to throw an exception or just log the error
        }

        // Delete the document record
        documentRepository.delete(document);
    }


    public QueryResponse queryDocuments(QueryRequest queryRequest, User user) {
        String cacheKey = generateCacheKey(queryRequest.getDocumentId(), queryRequest.getQuestion());

        String cachedResponse = redisTemplate.opsForValue().get(cacheKey);
        if (cachedResponse != null) {
            try {
                logger.info("Cache hit for query: {}", cacheKey);
                return objectMapper.readValue(cachedResponse, QueryResponse.class);
            } catch (JsonProcessingException e) {
                logger.error("Error deserializing cached response for key {}: {}", cacheKey, e.getMessage());
            }
        }

        Document document = documentRepository.findById(queryRequest.getDocumentId())
                .orElseThrow(() -> new RuntimeException("Document not found with ID: " + queryRequest.getDocumentId()));

        if (document.getStatus() != DocumentStatus.COMPLETED) {
            throw new IllegalStateException("Document is not yet processed. Current status: " + document.getStatus());
        }

        PythonQueryRequest pythonQueryRequest = PythonQueryRequest.builder()
                .question(queryRequest.getQuestion())
                .document_id(document.getPythonDocumentId())
                .build();

        WebClient webClient = webClientBuilder.baseUrl(ragServiceBaseUrl).build();
        Mono<QueryResponse> responseMono = webClient.post()
                .uri("/ask")
                .bodyValue(pythonQueryRequest)
                .retrieve()
                .bodyToMono(QueryResponse.class)
                .doOnError(error -> logger.error("Error querying RAG service: " + error.getMessage(), error));

        QueryResponse queryResponse = responseMono.block();

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
