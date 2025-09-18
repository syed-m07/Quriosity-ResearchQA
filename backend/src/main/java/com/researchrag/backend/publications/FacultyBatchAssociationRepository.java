package com.researchrag.backend.publications;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacultyBatchAssociationRepository extends JpaRepository<FacultyBatchAssociation, Long> {

    List<FacultyBatchAssociation> findByBatchId(Long batchId);

    @Query("SELECT fba.faculty.id FROM FacultyBatchAssociation fba WHERE fba.batch.id = :batchId")
    List<Long> findFacultyIdsByBatchId(@Param("batchId") Long batchId);

    boolean existsByFacultyAndBatch(Faculty faculty, FacultyUploadBatch batch);
}
