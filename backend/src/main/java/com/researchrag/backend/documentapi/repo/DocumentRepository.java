package com.researchrag.backend.documentapi.repo;

import com.researchrag.backend.documentapi.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
}
