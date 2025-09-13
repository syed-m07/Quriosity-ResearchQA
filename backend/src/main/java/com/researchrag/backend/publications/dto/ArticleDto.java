
package com.researchrag.backend.publications.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleDto {
    private String title;
    private String link;
    private String authors;
    private String publication;
    private Integer citations;
    private Integer year;
}
