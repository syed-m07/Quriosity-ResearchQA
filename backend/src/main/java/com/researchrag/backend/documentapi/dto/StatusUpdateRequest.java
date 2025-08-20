package com.researchrag.backend.documentapi.dto;

import com.researchrag.backend.documentapi.model.DocumentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateRequest {
    private Long documentId;
    private DocumentStatus status;
    private String pythonDocumentId; // Can be null if status is FAILED
    private String errorMessage;
}
