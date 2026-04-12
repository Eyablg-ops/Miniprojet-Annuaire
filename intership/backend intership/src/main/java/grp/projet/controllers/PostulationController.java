package grp.projet.controllers;

import grp.projet.entities.Offer;
import grp.projet.entities.Postulation;
import grp.projet.entities.Recruiter;
import grp.projet.entities.Student;
import grp.projet.repositories.OfferRepository;
import grp.projet.repositories.PostulationRepository;
import grp.projet.repositories.RecruiterRepository;
import grp.projet.repositories.StudentRepository;
import grp.projet.services.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/postulations")
@CrossOrigin(origins = "http://localhost:3000")
public class PostulationController {

    @Autowired private PostulationRepository postulationRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private RecruiterRepository recruiterRepository;
    @Autowired private OfferRepository offerRepository;
    @Autowired private FileStorageService fileStorageService;

    // ── Helper : student connecté via JWT ───────────────────────
    private Student getCurrentStudent() {
        Authentication auth = SecurityContextHolder.getContext()
                .getAuthentication();
        return studentRepository.findByUserEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    // ── Helper : recruiter connecté via JWT ─────────────────────
    private Recruiter getCurrentRecruiter() {
        Authentication auth = SecurityContextHolder.getContext()
                .getAuthentication();
        return recruiterRepository.findByUserEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
    }

    // ── POST /api/postulations/offre/{offreId} ──────────────────
    @PostMapping(value = "/offre/{offreId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> postuler(
            @PathVariable Long offreId,
            @RequestParam(value = "coverLetter", required = false) String coverLetter,
            @RequestParam(value = "cv", required = false) MultipartFile cv) {
        try {
            Student student = getCurrentStudent();

            // Anti-doublon
            if (postulationRepository.existsByStudentIdAndOfferId(student.getId(), offreId)) {
                return ResponseEntity.badRequest()
                        .body("Vous avez déjà postulé à cette offre");
            }

            Postulation p = new Postulation();
            p.setStudent(student);
            p.setOfferId(offreId);
            p.setCoverLetter(coverLetter);

            // Upload CV optionnel
            if (cv != null && !cv.isEmpty()) {
                String contentType = cv.getContentType();
                if (contentType == null ||
                        (!contentType.equals("application/pdf") &&
                                !contentType.equals("application/msword") &&
                                !contentType.contains("wordprocessingml"))) {
                    return ResponseEntity.badRequest()
                            .body("Format invalide : PDF ou Word uniquement");
                }
                String fileName = fileStorageService.saveFile(cv);
                p.setCvUrl(fileName);
            }

            postulationRepository.save(p);

            Map<String, Object> result = new HashMap<>();
            result.put("id", p.getId());
            result.put("offerId", p.getOfferId());
            result.put("status", p.getStatus().toString());
            result.put("coverLetter", p.getCoverLetter());
            result.put("cvUrl", p.getCvUrl());
            result.put("appliedAt", p.getAppliedAt() != null ? p.getAppliedAt().toString() : null);
            result.put("studentId", student.getId());

            return ResponseEntity.status(HttpStatus.CREATED).body(result);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Erreur : " + e.getMessage());
        }
    }

    // ── GET /api/postulations/my (Student) ───────────────────────
    @GetMapping("/my")
    public ResponseEntity<?> myApplications() {
        Student student = getCurrentStudent();

        List<Map<String, Object>> list = postulationRepository
                .findByStudentId(student.getId())
                .stream()
                .map(p -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", p.getId());
                    m.put("offerId", p.getOfferId());
                    m.put("status", p.getStatus().toString());
                    m.put("coverLetter", p.getCoverLetter());
                    m.put("cvUrl", p.getCvUrl());
                    m.put("appliedAt", p.getAppliedAt() != null ? p.getAppliedAt().toString() : null);

                    // Get offer details
                    offerRepository.findById(p.getOfferId()).ifPresent(offer -> {
                        m.put("offerTitle", offer.getTitle());
                        m.put("companyName", offer.getCompany().getName());
                    });

                    return m;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(list);
    }

    // ── GET /api/postulations/recruiter (ALL applications for recruiter's company) ──
    @GetMapping("/recruiter")
    public ResponseEntity<?> getApplicationsForRecruiter() {
        try {
            Recruiter recruiter = getCurrentRecruiter();
            Long companyId = recruiter.getCompany().getId();

            // Get all offers for this company
            List<Offer> companyOffers = offerRepository.findByCompanyId(companyId);
            List<Long> offerIds = companyOffers.stream()
                    .map(Offer::getId)
                    .collect(Collectors.toList());

            // Get all postulations for these offers
            List<Postulation> postulations = postulationRepository.findByOfferIdIn(offerIds);

            List<Map<String, Object>> result = postulations.stream()
                    .map(p -> {
                        Map<String, Object> m = new HashMap<>();
                        m.put("id", p.getId());
                        m.put("offerId", p.getOfferId());
                        m.put("status", p.getStatus().toString());
                        m.put("coverLetter", p.getCoverLetter());
                        m.put("cvUrl", p.getCvUrl());
                        m.put("appliedAt", p.getAppliedAt() != null ? p.getAppliedAt().toString() : null);

                        // Get offer details
                        offerRepository.findById(p.getOfferId()).ifPresent(offer -> {
                            m.put("offerTitle", offer.getTitle());
                            m.put("offerDescription", offer.getDescription());
                            m.put("offerLocation", offer.getLocation());
                            m.put("offerType", offer.getType());
                            m.put("offerDuration", offer.getDuration());
                        });

                        // Student details
                        Student s = p.getStudent();
                        m.put("studentId", s.getId());
                        m.put("studentFirstName", s.getFirstName());
                        m.put("studentLastName", s.getLastName());
                        m.put("studentEmail", s.getUser() != null ? s.getUser().getEmail() : null);
                        m.put("studentPhone", s.getPhone());
                        m.put("studentEducationLevel", s.getEducationLevel());
                        m.put("studentMajor", s.getMajor());
                        m.put("studentUniversity", s.getUniversity());

                        // Student skills
                        if (s.getSkills() != null) {
                            List<Map<String, String>> skills = s.getSkills().stream()
                                    .map(skill -> {
                                        Map<String, String> skillMap = new HashMap<>();
                                        skillMap.put("name", skill.getSkillName());
                                        skillMap.put("level", skill.getSkillLevel().toString());
                                        return skillMap;
                                    })
                                    .collect(Collectors.toList());
                            m.put("studentSkills", skills);
                        }

                        return m;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Erreur : " + e.getMessage());
        }
    }

    // ── GET /api/postulations/offre/{offreId} (Recruiter - single offer) ──
    @GetMapping("/offre/{offreId}")
    public ResponseEntity<?> getByOffre(@PathVariable Long offreId) {
        try {
            Recruiter recruiter = getCurrentRecruiter();

            // Verify the offer belongs to the recruiter's company
            Offer offer = offerRepository.findById(offreId)
                    .orElseThrow(() -> new RuntimeException("Offer not found"));

            if (!offer.getCompany().getId().equals(recruiter.getCompany().getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Vous n'avez pas accès à cette offre");
            }

            List<Map<String, Object>> list = postulationRepository
                    .findByOfferId(offreId)
                    .stream()
                    .map(p -> {
                        Map<String, Object> m = new HashMap<>();
                        m.put("id", p.getId());
                        m.put("offerId", p.getOfferId());
                        m.put("status", p.getStatus().toString());
                        m.put("coverLetter", p.getCoverLetter());
                        m.put("cvUrl", p.getCvUrl());
                        m.put("appliedAt", p.getAppliedAt() != null ? p.getAppliedAt().toString() : null);

                        // Student details
                        Student s = p.getStudent();
                        m.put("studentId", s.getId());
                        m.put("studentFirstName", s.getFirstName());
                        m.put("studentLastName", s.getLastName());
                        m.put("studentEmail", s.getUser() != null ? s.getUser().getEmail() : null);
                        m.put("studentPhone", s.getPhone());
                        m.put("studentEducationLevel", s.getEducationLevel());
                        m.put("studentMajor", s.getMajor());
                        m.put("studentUniversity", s.getUniversity());
                        m.put("studentSkills", s.getSkills());

                        return m;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(list);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Erreur : " + e.getMessage());
        }
    }

    // ── GET /api/postulations/fichier/{fileName} ─────────────────
    @GetMapping("/fichier/{fileName:.+}")
    public ResponseEntity<Resource> downloadCv(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get("uploads/postulations").resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = fileName.endsWith(".pdf") ? "application/pdf" : "application/octet-stream";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ── PATCH /api/postulations/{id}/statut ─────────────────
    @PatchMapping("/{id}/statut")
    public ResponseEntity<?> changerStatut(@PathVariable Long id, @RequestParam String statut) {
        return postulationRepository.findById(id)
                .map(p -> {
                    try {
                        // Verify the recruiter has access to this application
                        Recruiter recruiter = getCurrentRecruiter();
                        Offer offer = offerRepository.findById(p.getOfferId())
                                .orElseThrow(() -> new RuntimeException("Offer not found"));

                        if (!offer.getCompany().getId().equals(recruiter.getCompany().getId())) {
                            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                    .body("Vous n'avez pas accès à cette candidature");
                        }

                        p.setStatus(grp.projet.entities.PostulationStatus.valueOf(statut.toUpperCase()));
                        postulationRepository.save(p);

                        Map<String, Object> m = new HashMap<>();
                        m.put("id", p.getId());
                        m.put("status", p.getStatus().toString());
                        return ResponseEntity.ok(m);

                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().body("Statut invalide : " + statut);
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
}