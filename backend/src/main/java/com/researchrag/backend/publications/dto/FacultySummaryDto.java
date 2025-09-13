
package com.researchrag.backend.publications.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FacultySummaryDto {
    private String faculty_id;
    private String name;
    private int publication_count;
}
