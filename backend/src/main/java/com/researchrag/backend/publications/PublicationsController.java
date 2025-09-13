
package com.researchrag.backend.publications;

import com.researchrag.backend.publications.dto.ArticleDto;
import com.researchrag.backend.publications.dto.FacultyProfileDto;
import com.researchrag.backend.publications.dto.FacultySummaryDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/publications")
public class PublicationsController {

    private final PublicationsService publicationsService;

    public PublicationsController(PublicationsService publicationsService) {
        this.publicationsService = publicationsService;
    }

    @PostMapping("/upload")
    public ResponseEntity<List<FacultySummaryDto>> uploadFacultyList(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(List.of());
        }
        try {
            List<FacultySummaryDto> processedSummaries = publicationsService.processAndSaveFacultyData(file);
            return ResponseEntity.ok(processedSummaries);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(List.of());
        }
    }

    @GetMapping("/profile/{facultyId}")
    public ResponseEntity<FacultyProfileDto> getFacultyProfile(@PathVariable String facultyId) {
        Optional<Faculty> facultyOptional = publicationsService.getFacultyProfileByFacultyId(facultyId);
        if (facultyOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Faculty faculty = facultyOptional.get();
        // Convert Faculty entity to DTO for API response
        FacultyProfileDto dto = new FacultyProfileDto(
                faculty.getFacultyId(),
                faculty.getName(),
                faculty.getAffiliations(),
                faculty.getGoogleScholarId(),
                faculty.getThumbnail(),
                faculty.getInterests(),
                faculty.getTotalCitations(),
                faculty.getHIndex(),
                faculty.getI10Index()
        );
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/articles/{facultyId}")
    public ResponseEntity<List<ArticleDto>> getFacultyArticles(
            @PathVariable String facultyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<Publication> publications = publicationsService.getArticlesByFacultyId(facultyId, page, size);
        List<ArticleDto> articleDtos = publications.stream()
                .map(pub -> new ArticleDto(
                        pub.getTitle(),
                        pub.getLink(),
                        pub.getAuthors(),
                        pub.getPublicationSource(),
                        pub.getCitations(),
                        pub.getYear()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(articleDtos);
    }
}
