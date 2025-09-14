
package com.researchrag.backend.publications;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Publication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000) // Authors list can be long
    private String authors;

    @Column(length = 1000)
    private String publicationSource;

    private Integer year;

    private Integer citations;

    @Column(length = 1000)
    private String link;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id", nullable = false)
    @JsonIgnore
    private Faculty faculty;
}
