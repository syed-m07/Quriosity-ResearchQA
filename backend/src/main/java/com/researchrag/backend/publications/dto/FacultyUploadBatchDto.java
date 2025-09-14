package com.researchrag.backend.publications.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacultyUploadBatchDto {
    private Long id;
    private String fileName;
    private LocalDateTime uploadDate;
    private int facultyCount;
}
