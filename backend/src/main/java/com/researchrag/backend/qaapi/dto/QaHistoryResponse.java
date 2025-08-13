package com.researchrag.backend.qaapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QaHistoryResponse {
    private String question;
    private String answer;
    private LocalDateTime timestamp;
}
