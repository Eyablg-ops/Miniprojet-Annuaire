package grp.projet.controllers;

import grp.projet.entities.Postulation;
import grp.projet.entities.Student;
import grp.projet.repositories.PostulationRepository;
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
    @Autowired private FileStorageService fileStorageService;

    // ── Helper : student connecté via JWT ───────────────────────
    private Student getCurrentStudent() {
        Authentication auth = SecurityContextHolder.getContext()
                .getAuthentication();
        return studentRepository.findByUserEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    // ── POST /api/postulations/offre/{offreId} ──────────────────
    // Form-data : coverLetter (texte) + cv (fichier PDF/Word optionnel)
    @PostMapping(value = "/offre/{offreId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> postuler(
            @PathVariable Long offreId,
            @RequestParam(value = "coverLetter", required = false)
            String coverLetter,
            @RequestParam(value = "cv", required = false)
            MultipartFile cv) {
        try {
            Student student = getCurrentStudent();

            // ── Anti-doublon ────────────────────────────────────
            if (postulationRepository.existsByStudentIdAndOfferId(
                    student.getId(), offreId)) {
                return ResponseEntity.badRequest()
                        .body("Vous avez déjà postulé à cette offre");
            }

            Postulation p = new Postulation();
            p.setStudent(student);
            p.setOfferId(offreId);
            p.setCoverLetter(coverLetter);

            // ── Upload CV optionnel ─────────────────────────────
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
                p.setCvUrl(fileName);   // @Transient ou @Column selon ton choix
            }

            postulationRepository.save(p);

            // ── Réponse Map (évite la sérialisation circulaire) ─
            Map<String, Object> result = new HashMap<>();
            result.put("id",          p.getId());
            result.put("offerId",     p.getOfferId());
            result.put("status",      p.getStatus().toString());
            result.put("coverLetter", p.getCoverLetter());
            result.put("cvUrl",       p.getCvUrl());
            result.put("appliedAt",   p.getAppliedAt() != null
                    ? p.getAppliedAt().toString() : null);
            result.put("studentId",   student.getId());

            return ResponseEntity.status(HttpStatus.CREATED).body(result);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Erreur : " + e.getMessage());
        }
    }

    // ── GET /api/postulations/my ────────────────────────────────
    @GetMapping("/my")
    public ResponseEntity<?> myApplications() {
        Student student = getCurrentStudent();

        List<Map<String, Object>> list = postulationRepository
                .findByStudentId(student.getId())
                .stream()
                .map(p -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id",          p.getId());
                    m.put("offerId",     p.getOfferId());
                    m.put("status",      p.getStatus().toString());
                    m.put("coverLetter", p.getCoverLetter());
                    m.put("cvUrl",       p.getCvUrl());
                    m.put("appliedAt",   p.getAppliedAt() != null
                            ? p.getAppliedAt().toString() : null);
                    return m;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(list);
    }

    // ── GET /api/postulations/fichier/{fileName} ─────────────────
    // Permet au front de télécharger / afficher le CV uploadé
    @GetMapping("/fichier/{fileName:.+}")
    public ResponseEntity<Resource> downloadCv(
            @PathVariable String fileName) {
        try {
            Path filePath = Paths.get("uploads/postulations")
                    .resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = fileName.endsWith(".pdf")
                    ? "application/pdf"
                    : "application/octet-stream";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + fileName + "\"")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    // ── GET /api/postulations/offre/{offreId} ────────────────
// Recruteur : voir toutes les candidatures pour une offre
    @GetMapping("/offre/{offreId}")
    public ResponseEntity<?> getByOffre(@PathVariable Long offreId) {
        List<Map<String, Object>> list = postulationRepository
                .findByOfferId(offreId)
                .stream()
                .map(p -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id",          p.getId());
                    m.put("offerId",     p.getOfferId());
                    m.put("status",      p.getStatus().toString());
                    m.put("coverLetter", p.getCoverLetter());
                    m.put("cvUrl",       p.getCvUrl());
                    m.put("appliedAt",   p.getAppliedAt() != null
                            ? p.getAppliedAt().toString() : null);
                    m.put("studentId",   p.getStudent().getId());

                    // Données student embarquées
                    Student s = p.getStudent();
                    m.put("studentFirstName",      s.getFirstName());
                    m.put("studentLastName",       s.getLastName());
                    m.put("studentEmail",          s.getUser() != null
                            ? s.getUser().getEmail() : null);
                    m.put("studentPhone",          s.getPhone());
                    m.put("studentEducationLevel", s.getEducationLevel());
                    m.put("studentMajor",          s.getMajor());
                    m.put("studentUniversity",     s.getUniversity());
                    m.put("studentSkills",         s.getSkills());
                    return m;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(list);
    }

    // ── PATCH /api/postulations/{id}/statut ─────────────────
// Recruteur : changer le statut d'une candidature
    @PatchMapping("/{id}/statut")
    public ResponseEntity<?> changerStatut(
            @PathVariable Long id,
            @RequestParam String statut) {
        return postulationRepository.findById(id)
                .map(p -> {
                    try {
                        p.setStatus(grp.projet.entities.PostulationStatus
                                .valueOf(statut.toUpperCase()));
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest()
                                .body((Object)("Statut invalide : " + statut));
                    }
                    postulationRepository.save(p);

                    Map<String, Object> m = new HashMap<>();
                    m.put("id",     p.getId());
                    m.put("status", p.getStatus().toString());
                    return ResponseEntity.ok((Object) m);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}