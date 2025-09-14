
package com.researchrag.backend.publications;

import com.researchrag.backend.publications.dto.ArticleDto;
import com.researchrag.backend.publications.dto.FacultyProfileDto;
import com.researchrag.backend.publications.dto.FacultySummaryDto;
import com.researchrag.backend.publications.dto.FacultyUploadBatchDto;
import com.researchrag.backend.userapi.user.User;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
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
    public ResponseEntity<List<FacultySummaryDto>> uploadFacultyList(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) Integer articlesLimit,
            @AuthenticationPrincipal User user) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            List<FacultySummaryDto> processedSummaries = publicationsService.processAndSaveFacultyData(file, user, articlesLimit);
            return ResponseEntity.ok(processedSummaries);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/batches")
    public ResponseEntity<List<FacultyUploadBatchDto>> getFacultyBatches(@AuthenticationPrincipal User user) {
        List<FacultyUploadBatchDto> batches = publicationsService.getFacultyBatches(user);
        return ResponseEntity.ok(batches);
    }

    @GetMapping("/batches/{batchId}/summaries")
    public ResponseEntity<List<FacultySummaryDto>> getFacultySummariesForBatch(
            @PathVariable Long batchId,
            @AuthenticationPrincipal User user) {
        List<FacultySummaryDto> summaries = publicationsService.getFacultySummariesForBatch(batchId, user);
        return ResponseEntity.ok(summaries);
    }

    @DeleteMapping("/batches/{batchId}")
    public ResponseEntity<Void> deleteFacultyBatch(@PathVariable Long batchId, @AuthenticationPrincipal User user) {
        publicationsService.deleteFacultyBatch(batchId, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export/{facultyId}")
    public ResponseEntity<InputStreamResource> exportFacultyProfile(@PathVariable String facultyId, @RequestParam String format) throws IOException {
        ByteArrayInputStream bis = publicationsService.exportFacultyProfile(facultyId, format);
        HttpHeaders headers = new HttpHeaders();
        String fileName = facultyId + "_report." + (format.equalsIgnoreCase("word") ? "docx" : "xlsx");
        headers.add("Content-Disposition", "attachment; filename=" + fileName);

        MediaType mediaType;
        if (format.equalsIgnoreCase("word")) {
            mediaType = MediaType.valueOf("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        } else {
            mediaType = MediaType.valueOf("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(mediaType)
                .body(new InputStreamResource(bis));
    }

    @GetMapping("/summary/{facultyId}")
    public ResponseEntity<String> getFacultySummary(
            @PathVariable String facultyId,
            @RequestParam(required = false) Integer fromYear,
            @RequestParam(required = false) Integer toYear) {
        String summary = publicationsService.getFacultySummary(facultyId, fromYear, toYear);
        return ResponseEntity.ok(summary);
    }


    @GetMapping("/profile/{facultyId}")
    public ResponseEntity<FacultyProfileDto> getFacultyProfile(@PathVariable String facultyId) {
        Optional<Faculty> facultyOptional = publicationsService.getFacultyProfileByFacultyId(facultyId);
        if (facultyOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Faculty faculty = facultyOptional.get();
        FacultyProfileDto dto = new FacultyProfileDto(
                faculty.getFacultyId(),
                faculty.getName(),
                faculty.getAffiliations(),
                faculty.getGoogleScholarId(),
                faculty.getThumbnail(),
                faculty.getInterests(),
                faculty.getTotalCitations(),
                faculty.getHIndex(),
                faculty.getI10Index(),
                faculty.getSummary()
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
