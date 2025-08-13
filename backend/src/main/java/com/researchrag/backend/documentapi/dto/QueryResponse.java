package com.researchrag.backend.documentapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QueryResponse {
    private String answer;
    private List<SourceDto> sources;
    private Boolean success;
    private String document_id;
    private ProcessingInfo processing_info;
}
