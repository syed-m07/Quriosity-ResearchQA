package com.researchrag.backend.publications;

import com.researchrag.backend.userapi.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacultyUploadBatchRepository extends JpaRepository<FacultyUploadBatch, Long> {
    List<FacultyUploadBatch> findByUserOrderByUploadDateDesc(User user);
}
