
package com.researchrag.backend.publications;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class Faculty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String facultyId;

    @Column(nullable = false)
    private String name;

    private String affiliations;

    @Column(unique = true)
    private String googleScholarId;

    @ElementCollection
    @CollectionTable(name = "faculty_interests", joinColumns = @JoinColumn(name = "faculty_id"))
    @Column(name = "interest")
    private List<String> interests;

    private String thumbnail;

    private Integer totalCitations;

    private Integer hIndex;

    private Integer i10Index;

    @OneToMany(mappedBy = "faculty", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Publication> publications;
}
