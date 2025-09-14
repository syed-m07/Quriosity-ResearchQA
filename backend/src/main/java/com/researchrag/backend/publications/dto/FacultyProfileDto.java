
package com.researchrag.backend.publications.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FacultyProfileDto {
    private String faculty_id;
    private String name;
    private String affiliations;
    private String google_scholar_author_id;
    private String thumbnail;
    private List<String> interests;
    private Integer total_citations;
    private Integer h_index;
    private Integer i10_index;
    private String summary;
}
