package grp.projet.controllers;

import grp.projet.entities.Recruiter;
import grp.projet.repositories.RecruiterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/recruiters")
public class RecruiterController {

    @Autowired
    private RecruiterRepository recruiterRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        Recruiter recruiter = recruiterRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        Map<String, Object> result = new HashMap<>();
        result.put("id",         recruiter.getId());
        result.put("firstName",  recruiter.getFirstName());
        result.put("lastName",   recruiter.getLastName());
        result.put("email",      recruiter.getUser().getEmail());
        result.put("position",   recruiter.getPosition());   // ← ajout
        result.put("phone",      recruiter.getPhone());      // ← ajout
        result.put("isVerified", recruiter.getIsVerified()); // ← ajout

        Map<String, Object> company = new HashMap<>();
        company.put("id",          recruiter.getCompany().getId());
        company.put("name",        recruiter.getCompany().getName());
        company.put("city",        recruiter.getCompany().getCity());
        company.put("country",     recruiter.getCompany().getCountry());     // ← ajout
        company.put("description", recruiter.getCompany().getDescription()); // ← ajout
        company.put("services",    recruiter.getCompany().getServices());     // ← ajout
        company.put("website",     recruiter.getCompany().getWebsite());      // ← ajout
        company.put("status",      recruiter.getCompany().getStatus());       // ← ajout
        company.put("source",      recruiter.getCompany().getSource());       // ← ajout
        company.put("createdAt",   recruiter.getCompany().getCreatedAt());    // ← ajout
        company.put("updatedAt",   recruiter.getCompany().getUpdatedAt());    // ← ajout
        result.put("company", company);

        return ResponseEntity.ok(result);
    }
}