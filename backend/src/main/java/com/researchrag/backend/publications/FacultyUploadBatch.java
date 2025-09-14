package com.researchrag.backend.publications;

import com.researchrag.backend.userapi.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @OneToMany(mappedBy = "facultyUploadBatch", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Faculty> facultyList = new ArrayList<>();
}
