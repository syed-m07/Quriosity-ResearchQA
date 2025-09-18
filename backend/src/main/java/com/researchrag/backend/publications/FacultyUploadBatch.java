package com.researchrag.backend.publications;

import com.researchrag.backend.userapi.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Data
public class FacultyUploadBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private LocalDateTime uploadDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "batch", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FacultyBatchAssociation> batchAssociations = new ArrayList<>();

    // Helper method to get faculty list through the association
    public List<Faculty> getFacultyList() {
        return this.batchAssociations.stream()
                .map(FacultyBatchAssociation::getFaculty)
                .collect(Collectors.toList());
    }
}
