package com.researchrag.backend.publications.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PythonSummarizationRequest {
    private String name;
    private List<PublicationDto> publications;
    private Integer from_year;
    private Integer to_year;
}
