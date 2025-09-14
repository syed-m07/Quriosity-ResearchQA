package com.researchrag.backend.publications.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicationDto {
    private String title;
    private String authors;
    private String publicationSource;
    private Integer year;
    private Integer citations;
    private String link;
}
