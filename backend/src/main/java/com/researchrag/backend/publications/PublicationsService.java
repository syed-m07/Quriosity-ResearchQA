package com.researchrag.backend.publications;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.researchrag.backend.publications.dto.FacultySummaryDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PublicationsService {

    private final WebClient webClient;
    private final FacultyRepository facultyRepository;
    private final PublicationRepository publicationRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${rag.service.base-url:http://localhost:8000}")
    private String pythonApiUrl;

    public PublicationsService(WebClient.Builder webClientBuilder, FacultyRepository facultyRepository, PublicationRepository publicationRepository) {
        this.webClient = webClientBuilder.build();
        this.facultyRepository = facultyRepository;
        this.publicationRepository = publicationRepository;
    }

    @Transactional
    public List<FacultySummaryDto> processAndSaveFacultyData(MultipartFile multipartFile) throws IOException {
        File tempFile = convertMultiPartToFile(multipartFile);
        List<FacultySummaryDto> processedSummaries = new ArrayList<>();

        try {
            MultipartBodyBuilder builder = new MultipartBodyBuilder();
            builder.part("file", new FileSystemResource(tempFile));

            Mono<JsonNode> responseMono = webClient.post()
                    .uri(pythonApiUrl + "/publications/upload")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .bodyValue(builder.build())
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .doOnError(error -> System.err.println("### WebClient Error: " + error.getMessage()))
                    .timeout(Duration.ofSeconds(120)); // Increased timeout for initial processing

            JsonNode responseNode = responseMono.block();

            if (responseNode != null && responseNode.isArray()) {
                for (JsonNode facultyData : responseNode) {
                    Faculty faculty = saveFacultyProfile(facultyData);
                    if (faculty != null) { // Check if faculty was saved (not null from saveFacultyProfile)
                        processedSummaries.add(new FacultySummaryDto(
                                faculty.getFacultyId(),
                                faculty.getName(),
                                faculty.getPublications().size()
                        ));
                    }
                }
            }
        } finally {
            if (tempFile.exists()) {
                tempFile.delete();
            }
        }
        return processedSummaries;
    }

    private Faculty saveFacultyProfile(JsonNode facultyData) {
        String facultyId = facultyData.path("faculty_id").asText();
        if (facultyId == null || facultyId.isEmpty()) return null; // Return null if no valid facultyId

        Faculty faculty = facultyRepository.findByFacultyId(facultyId).orElse(new Faculty());
        faculty.setFacultyId(facultyId);

        JsonNode profileNode = facultyData.path("author_profile");
        faculty.setName(profileNode.path("name").asText());
        faculty.setAffiliations(profileNode.path("affiliations").asText());
        
        String googleScholarId = facultyData.path("google_scholar_author_id").asText();
        if (googleScholarId.isEmpty()) {
            faculty.setGoogleScholarId(null);
        } else {
            faculty.setGoogleScholarId(googleScholarId);
        }

        faculty.setThumbnail(profileNode.path("thumbnail").asText());

        List<String> interests = new ArrayList<>();
        profileNode.path("interests").forEach(interest -> interests.add(interest.asText()));
        faculty.setInterests(interests);

        JsonNode metricsNode = facultyData.path("citation_metrics");
        faculty.setTotalCitations(metricsNode.path("total_citations").asInt(0));
        faculty.setHIndex(metricsNode.path("h_index").asInt(0));
        faculty.setI10Index(metricsNode.path("i10_index").asInt(0));

        // Clear old publications to prevent duplicates on re-processing
        if (faculty.getPublications() != null) {
            faculty.getPublications().clear();
        } else {
            faculty.setPublications(new ArrayList<>());
        }

        JsonNode articlesNode = facultyData.path("articles");
        if (articlesNode.isArray()) {
            for (JsonNode articleNode : articlesNode) {
                Publication publication = new Publication();
                publication.setTitle(articleNode.path("title").asText());
                publication.setAuthors(articleNode.path("authors").asText());
                publication.setPublicationSource(articleNode.path("publication").asText());
                publication.setYear(articleNode.path("year").asInt(0));
                publication.setCitations(articleNode.path("citations").asInt(0));
                publication.setLink(articleNode.path("link").asText());
                publication.setFaculty(faculty);
                faculty.getPublications().add(publication);
            }
        }
        return facultyRepository.save(faculty);
    }

    private File convertMultiPartToFile(MultipartFile file) throws IOException {
        File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + Objects.requireNonNull(file.getOriginalFilename()));
        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            fos.write(file.getBytes());
        }
        return convFile;
    }

    // New methods for fetching data for frontend
    @Transactional(readOnly = true)
    public Optional<Faculty> getFacultyProfileByFacultyId(String facultyId) {
        return facultyRepository.findByFacultyId(facultyId);
    }

    @Transactional(readOnly = true)
    public List<Publication> getArticlesByFacultyId(String facultyId, int page, int size) {
        Optional<Faculty> facultyOptional = facultyRepository.findByFacultyId(facultyId);
        if (facultyOptional.isPresent()) {
            Faculty faculty = facultyOptional.get();
            // Assuming publications are eagerly loaded or fetched via a custom query
            // For simplicity, if publications are lazily loaded, this might require a custom query in PublicationRepository
            // For now, we rely on the @OneToMany relationship and assume it's handled by Hibernate
            Pageable pageable = PageRequest.of(page, size);
            // This will fetch all publications for the faculty and then paginate in memory
            // For very large number of publications, a custom query in PublicationRepository would be more efficient
            return faculty.getPublications().stream()
                    .skip((long) page * size)
                    .limit(size)
                    .collect(Collectors.toList());
        }
        return List.of();
    }
}