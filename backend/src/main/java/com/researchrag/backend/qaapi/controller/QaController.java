package com.researchrag.backend.qaapi.controller;

import com.researchrag.backend.qaapi.dto.QaHistoryResponse;
import com.researchrag.backend.qaapi.dto.QaRequest;
import com.researchrag.backend.qaapi.dto.QaResponse;
import com.researchrag.backend.qaapi.service.QaService;
import com.researchrag.backend.userapi.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/qa")
@RequiredArgsConstructor
public class QaController {

    private final QaService qaService;

    @PostMapping("/ask")
    public ResponseEntity<QaResponse> askQuestion(
            @RequestBody QaRequest qaRequest,
            @AuthenticationPrincipal User user
    ) {
        QaResponse response = qaService.askQuestion(qaRequest, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history/{documentId}")
    public ResponseEntity<List<QaHistoryResponse>> getHistory(
            @PathVariable Long documentId,
            @AuthenticationPrincipal User user
    ) {
        List<QaHistoryResponse> history = qaService.getHistory(documentId, user);
        return ResponseEntity.ok(history);
    }
}
