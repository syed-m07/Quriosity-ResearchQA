
package com.researchrag.backend.publications;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Optional<Faculty> findByFacultyId(String facultyId);

    @Query("SELECT f FROM Faculty f JOIN f.batchAssociations ba WHERE ba.batch.id = :batchId")
    List<Faculty> findByBatchId(@Param("batchId") Long batchId);
}
