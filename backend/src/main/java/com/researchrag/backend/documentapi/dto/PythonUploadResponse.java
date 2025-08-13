package com.researchrag.backend.documentapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PythonUploadResponse {
    private Boolean success;
    private String document_id;
    private String message;
    private Integer chunks_processed;
}