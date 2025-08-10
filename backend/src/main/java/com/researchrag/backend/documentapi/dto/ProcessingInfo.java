package com.researchrag.backend.documentapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcessingInfo {
    private Integer chunks_used;
    private Boolean question_processed;
    private String model_used;
}