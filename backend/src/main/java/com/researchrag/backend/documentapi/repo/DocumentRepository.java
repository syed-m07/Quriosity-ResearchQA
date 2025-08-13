package com.researchrag.backend.documentapi.repo;

import com.researchrag.backend.documentapi.model.Document;
import com.researchrag.backend.userapi.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByUser(User user);
}
