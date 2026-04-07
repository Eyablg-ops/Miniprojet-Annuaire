package grp.projet.controllers;

import grp.projet.entities.Company;
import grp.projet.entities.Internship;
import grp.projet.repositories.CompanyRepository;
import grp.projet.repositories.InternshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/internships")
@CrossOrigin(origins = "*")
public class InternshipController {

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createInternship(@RequestBody Map<String, Object> request) {
        try {
            Long companyId = ((Number) request.get("companyId")).longValue();
            Company company = companyRepository.findById(companyId)
                    .orElseThrow(() -> new RuntimeException("Company not found"));

            Internship internship = new Internship();
            internship.setCompany(company);
            internship.setTitle((String) request.get("title"));
            internship.setDescription((String) request.get("description"));
            internship.setRequiredSkills((String) request.get("requiredSkills"));
            internship.setLocation((String) request.get("location"));

            if (request.get("durationMonths") != null) {
                internship.setDurationMonths(((Number) request.get("durationMonths")).intValue());
            }

            internship.setStartDate((String) request.get("startDate"));

            Internship savedInternship = internshipRepository.save(internship);
            return ResponseEntity.ok(savedInternship);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating internship: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Internship>> getAllInternships() {
        List<Internship> internships = internshipRepository.findAll();
        return ResponseEntity.ok(internships);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getInternshipById(@PathVariable Long id) {
        Internship internship = internshipRepository.findById(id)
                .orElse(null);

        if (internship == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(internship);
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<Internship>> getInternshipsByCompany(@PathVariable Long companyId) {
        Company company = companyRepository.findById(companyId).orElse(null);

        if (company == null) {
            return ResponseEntity.notFound().build();
        }

        List<Internship> internships = internshipRepository.findByCompany(company);
        return ResponseEntity.ok(internships);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateInternship(@PathVariable Long id, @RequestBody Internship internshipDetails) {
        try {
            Internship internship = internshipRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Internship not found"));

            internship.setTitle(internshipDetails.getTitle());
            internship.setDescription(internshipDetails.getDescription());
            internship.setRequiredSkills(internshipDetails.getRequiredSkills());
            internship.setLocation(internshipDetails.getLocation());
            internship.setDurationMonths(internshipDetails.getDurationMonths());
            internship.setStartDate(internshipDetails.getStartDate());

            Internship updatedInternship = internshipRepository.save(internship);
            return ResponseEntity.ok(updatedInternship);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating internship: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteInternship(@PathVariable Long id) {
        try {
            internshipRepository.deleteById(id);
            return ResponseEntity.ok("Internship deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting internship: " + e.getMessage());
        }
    }
}