package com.researchrag.backend.documentapi.controller;

import com.researchrag.backend.documentapi.dto.DocumentMetadataDto;
import com.researchrag.backend.documentapi.dto.QueryRequest;
import com.researchrag.backend.documentapi.dto.QueryResponse;
import com.researchrag.backend.documentapi.service.DocumentService;
import com.researchrag.backend.userapi.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
public class DocumentController {

    private static final Logger logger = LoggerFactory.getLogger(DocumentController.class);

    private final DocumentService documentService;

    @GetMapping
    public ResponseEntity<List<DocumentMetadataDto>> getAllDocuments(
            @AuthenticationPrincipal User user
    ) {
        List<DocumentMetadataDto> documents = documentService.getAllDocuments(user);
        return ResponseEntity.ok(documents);
    }

    @PostMapping
    public ResponseEntity<DocumentMetadataDto> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user
    ) {
        try {
            DocumentMetadataDto metadata = documentService.uploadAndProcessDocument(file, user);
            return new ResponseEntity<>(metadata, HttpStatus.ACCEPTED);
        } catch (IOException e) {
            logger.error("IOException during file upload: " + e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            logger.error("Unexpected error during file upload: " + e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
