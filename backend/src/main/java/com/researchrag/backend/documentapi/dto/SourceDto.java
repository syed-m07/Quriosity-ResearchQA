package com.researchrag.backend.documentapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SourceDto {
    private String text;
    private String metadata;
    private Double relevance_score;
    private String section_type;
}