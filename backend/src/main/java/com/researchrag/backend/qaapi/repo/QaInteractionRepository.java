package com.researchrag.backend.qaapi.repo;

import com.researchrag.backend.qaapi.model.QaInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface QaInteractionRepository extends JpaRepository<QaInteraction, Long> {
    List<QaInteraction> findByDocumentIdAndUserIdOrderByTimestampAsc(Long documentId, Integer userId);

    @Modifying
    void deleteByDocumentId(Long documentId);
}
