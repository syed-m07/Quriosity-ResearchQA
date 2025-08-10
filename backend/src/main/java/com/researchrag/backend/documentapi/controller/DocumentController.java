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

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping
    public ResponseEntity<DocumentMetadataDto> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user // Get authenticated user directly
    ) throws IOException {
        DocumentMetadataDto metadata = documentService.uploadAndProcessDocument(file, user);
        return new ResponseEntity<>(metadata, HttpStatus.ACCEPTED);
    }

    @PostMapping("/query")
    public ResponseEntity<QueryResponse> queryDocuments(
            @RequestBody QueryRequest queryRequest,
            @AuthenticationPrincipal User user // Get authenticated user directly
    ) {
        QueryResponse response = documentService.queryDocuments(queryRequest, user);
        return ResponseEntity.ok(response);
    }
}
