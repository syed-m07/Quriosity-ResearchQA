package com.researchrag.backend.documentapi.model;

import com.researchrag.backend.userapi.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "documents")
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fileName;
    private String storageFileName; // The unique name of the file stored on the server
    private String contentType;
    private Long size; // in bytes
    @Enumerated(EnumType.STRING)
    private DocumentStatus status;
    private LocalDateTime uploadDate;
    private String pythonDocumentId; // New field to store Python's UUID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
