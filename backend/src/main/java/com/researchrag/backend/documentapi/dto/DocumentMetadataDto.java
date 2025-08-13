package com.researchrag.backend.documentapi.dto;

import com.researchrag.backend.documentapi.model.DocumentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentMetadataDto {
    private Long id;
    private String fileName;
    private LocalDateTime uploadDate;
    private DocumentStatus status;
    private String pythonDocumentId; // New field
}
