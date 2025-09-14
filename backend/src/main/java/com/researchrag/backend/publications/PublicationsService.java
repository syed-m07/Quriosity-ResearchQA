package com.researchrag.backend.publications;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.researchrag.backend.publications.dto.*;
import com.researchrag.backend.userapi.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PublicationsService {

    private static final Logger logger = LoggerFactory.getLogger(PublicationsService.class);
    private final WebClient webClient;
    private final FacultyRepository facultyRepository;
    private final FacultyUploadBatchRepository facultyUploadBatchRepository;
    private final ExportService exportService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${rag.service.base-url:http://localhost:8000}")
    private String pythonApiUrl;

    public PublicationsService(WebClient.Builder webClientBuilder, FacultyRepository facultyRepository,
                               FacultyUploadBatchRepository facultyUploadBatchRepository, ExportService exportService) {
        this.webClient = webClientBuilder.build();
        this.facultyRepository = facultyRepository;
        this.facultyUploadBatchRepository = facultyUploadBatchRepository;
        this.exportService = exportService;
    }

    @Transactional
    public List<FacultySummaryDto> processAndSaveFacultyData(MultipartFile multipartFile, User user, Integer articlesLimit) throws IOException {
        File tempFile = convertMultiPartToFile(multipartFile);
        List<FacultySummaryDto> processedSummaries = new ArrayList<>();

        FacultyUploadBatch batch = new FacultyUploadBatch();
        batch.setFileName(multipartFile.getOriginalFilename());
        batch.setUploadDate(LocalDateTime.now());
        batch.setUser(user);
        FacultyUploadBatch savedBatch = facultyUploadBatchRepository.save(batch);

        try {
            MultipartBodyBuilder builder = new MultipartBodyBuilder();
            builder.part("file", new FileSystemResource(tempFile));
            if (articlesLimit != null) {
                builder.part("articles_limit", articlesLimit);
            }

            Mono<JsonNode> responseMono = webClient.post()
                    .uri(pythonApiUrl + "/publications/upload")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .bodyValue(builder.build())
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .doOnError(error -> System.err.println("### WebClient Error: " + error.getMessage()))
                    .timeout(Duration.ofMinutes(5)); // Increased timeout for potentially long processing

            JsonNode responseNode = responseMono.block();

            if (responseNode != null && responseNode.isArray()) {
                for (JsonNode facultyData : responseNode) {
                    Faculty faculty = saveFacultyProfile(facultyData, savedBatch);
                    if (faculty != null) {
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

    private Faculty saveFacultyProfile(JsonNode facultyData, FacultyUploadBatch batch) {
        String facultyId = facultyData.path("faculty_id").asText();
        if (facultyId == null || facultyId.isEmpty()) return null;

        Faculty faculty = new Faculty();
        faculty.setFacultyId(facultyId);
        faculty.setFacultyUploadBatch(batch);

        JsonNode profileNode = facultyData.path("author_profile");
        faculty.setName(profileNode.path("name").asText());
        faculty.setAffiliations(profileNode.path("affiliations").asText());
        
        String googleScholarId = facultyData.path("google_scholar_author_id").asText();
        faculty.setGoogleScholarId(googleScholarId.isEmpty() ? null : googleScholarId);

        faculty.setThumbnail(profileNode.path("thumbnail").asText());

        List<String> interests = new ArrayList<>();
        profileNode.path("interests").forEach(interest -> interests.add(interest.asText()));
        faculty.setInterests(interests);

        JsonNode metricsNode = facultyData.path("citation_metrics");
        faculty.setTotalCitations(metricsNode.path("total_citations").asInt(0));
        faculty.setHIndex(metricsNode.path("h_index").asInt(0));
        faculty.setI10Index(metricsNode.path("i10_index").asInt(0));

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

    @Transactional(readOnly = true)
    public Optional<Faculty> getFacultyProfileByFacultyId(String facultyId) {
        return facultyRepository.findByFacultyId(facultyId);
    }

    @Transactional(readOnly = true)
    public List<Publication> getArticlesByFacultyId(String facultyId, int page, int size) {
        Optional<Faculty> facultyOptional = facultyRepository.findByFacultyId(facultyId);
        if (facultyOptional.isPresent()) {
            Faculty faculty = facultyOptional.get();
            Pageable pageable = PageRequest.of(page, size);
            return faculty.getPublications().stream()
                    .skip((long) page * size)
                    .limit(size)
                    .collect(Collectors.toList());
        }
        return List.of();
    }

    @Transactional(readOnly = true)
    public List<FacultyUploadBatchDto> getFacultyBatches(User user) {
        return facultyUploadBatchRepository.findByUserOrderByUploadDateDesc(user).stream()
                .map(batch -> new FacultyUploadBatchDto(
                        batch.getId(),
                        batch.getFileName(),
                        batch.getUploadDate(),
                        batch.getFacultyList().size()
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FacultySummaryDto> getFacultySummariesForBatch(Long batchId, User user) {
        FacultyUploadBatch batch = facultyUploadBatchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));
        if (!batch.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to access this batch.");
        }
        return facultyRepository.findByFacultyUploadBatchId(batchId).stream()
                .map(faculty -> new FacultySummaryDto(
                        faculty.getFacultyId(),
                        faculty.getName(),
                        faculty.getPublications().size()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteFacultyBatch(Long batchId, User user) {
        FacultyUploadBatch batch = facultyUploadBatchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));
        if (!batch.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to delete this batch.");
        }
        facultyUploadBatchRepository.deleteById(batchId);
    }

    @Transactional
    public String getFacultySummary(String facultyId, Integer fromYear, Integer toYear) {
        Faculty faculty = facultyRepository.findByFacultyId(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        List<Publication> publicationsToSummarize = faculty.getPublications().stream()
                .filter(p -> (fromYear == null || (p.getYear() != null && p.getYear() >= fromYear)) && (toYear == null || (p.getYear() != null && p.getYear() <= toYear)))
                .collect(Collectors.toList());

        List<PublicationDto> publicationDtos = publicationsToSummarize.stream()
                .map(p -> new PublicationDto(p.getTitle(), p.getAuthors(), p.getPublicationSource(), p.getYear(), p.getCitations(), p.getLink()))
                .collect(Collectors.toList());

        PythonSummarizationRequest request = PythonSummarizationRequest.builder()
                .name(faculty.getName())
                .publications(publicationDtos)
                .from_year(fromYear)
                .to_year(toYear)
                .build();

        try {
            PythonSummarizationResponse pythonResponse = webClient.post()
                    .uri(pythonApiUrl + "/publications/summarize")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(PythonSummarizationResponse.class)
                    .timeout(Duration.ofMinutes(2)) // Add a 2-minute timeout for the LLM call
                    .block();

            if (pythonResponse != null && pythonResponse.getSummary() != null) {
                faculty.setSummary(pythonResponse.getSummary());
                facultyRepository.save(faculty);
                return pythonResponse.getSummary();
            }
            return "Failed to generate summary.";
        } catch (WebClientResponseException e) {
            logger.error("Error from Python summarization service: Status {}, Body {}", e.getRawStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("The summarization service failed to process the request. Details: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            logger.error("An unexpected error occurred during summarization for facultyId {}: {}", facultyId, e.getMessage());
            throw new RuntimeException("An unexpected error occurred while generating the summary.");
        }
    }

    public ByteArrayInputStream exportFacultyProfile(String facultyId, String format) throws IOException {
        Faculty faculty = facultyRepository.findByFacultyId(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        if ("excel".equalsIgnoreCase(format)) {
            return exportService.generateExcelReport(faculty);
        } else if ("word".equalsIgnoreCase(format)) {
            return exportService.generateWordReport(faculty);
        }
        throw new IllegalArgumentException("Invalid export format specified.");
    }
}
