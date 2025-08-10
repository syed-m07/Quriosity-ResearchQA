package com.researchrag.backend.qaapi.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.researchrag.backend.documentapi.dto.PythonQueryRequest;
import com.researchrag.backend.documentapi.dto.QueryResponse;
import com.researchrag.backend.documentapi.model.Document;
import com.researchrag.backend.documentapi.repo.DocumentRepository;
import com.researchrag.backend.qaapi.dto.QaHistoryResponse;
import com.researchrag.backend.qaapi.dto.QaRequest;
import com.researchrag.backend.qaapi.dto.QaResponse;
import com.researchrag.backend.qaapi.model.QaInteraction;
import com.researchrag.backend.qaapi.repo.QaInteractionRepository;
import com.researchrag.backend.userapi.user.User;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QaService {

    private static final Logger logger = LoggerFactory.getLogger(QaService.class);

    private final QaInteractionRepository qaInteractionRepository;
    private final DocumentRepository documentRepository;
    private final WebClient.Builder webClientBuilder;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final long CACHE_TTL_SECONDS = 300; // 5 minutes

    @Value("${rag.service.base-url}")
    private String ragServiceBaseUrl;

    public QaResponse askQuestion(QaRequest qaRequest, User user) {
        String cacheKey = generateCacheKey(qaRequest.getDocumentId(), qaRequest.getQuestion());

        // Try to retrieve from cache
        String cachedResponse = redisTemplate.opsForValue().get(cacheKey);
        if (cachedResponse != null) {
            try {
                logger.info("Cache hit for query: {}", cacheKey);
                return objectMapper.readValue(cachedResponse, QaResponse.class);
            } catch (JsonProcessingException e) {
                logger.error("Error deserializing cached response for key {}: {}", cacheKey, e.getMessage());
                // Fall through to actual service call if deserialization fails
            }
        }

        // Retrieve the Document entity to get the Python-generated documentId
        Document document = documentRepository.findById(qaRequest.getDocumentId())
                .orElseThrow(() -> new RuntimeException("Document not found with ID: " + qaRequest.getDocumentId()));

        // Create a new PythonQueryRequest for the Python service with the correct document_id
        PythonQueryRequest pythonQueryRequest = PythonQueryRequest.builder()
                .question(qaRequest.getQuestion())
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

        // Save interaction to DB
        QaInteraction qaInteraction = QaInteraction.builder()
                .user(user)
                .document(document)
                .question(qaRequest.getQuestion())
                .answer(queryResponse != null ? queryResponse.getAnswer() : "")
                .timestamp(LocalDateTime.now())
                .build();
        qaInteractionRepository.save(qaInteraction);

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

        // Map QueryResponse to QaResponse (they are structurally similar)
        return QaResponse.builder()
                .answer(queryResponse != null ? queryResponse.getAnswer() : null)
                .sources(queryResponse != null ? queryResponse.getSources() : null)
                .success(queryResponse != null ? queryResponse.getSuccess() : false)
                .document_id(queryResponse != null ? queryResponse.getDocument_id() : null)
                .processing_info(queryResponse != null ? queryResponse.getProcessing_info() : null)
                .build();
    }

    public List<QaHistoryResponse> getHistory(Long documentId, User user) {
        List<QaInteraction> interactions = qaInteractionRepository.findByDocumentIdAndUserIdOrderByTimestampAsc(documentId, user.getId());
        return interactions.stream()
                .map(interaction -> QaHistoryResponse.builder()
                        .question(interaction.getQuestion())
                        .answer(interaction.getAnswer())
                        .timestamp(interaction.getTimestamp())
                        .build())
                .collect(Collectors.toList());
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
            return "qa_query:" + documentId + ":" + hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            logger.error("SHA-256 algorithm not found, falling back to simple key generation", e);
            return "qa_query:" + documentId + ":" + question.hashCode(); // Fallback
        }
    }
}
