package grp.projet.controllers;

import grp.projet.entities.Recruiter;
import grp.projet.repositories.RecruiterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recruiters")
@CrossOrigin(origins = "http://localhost:3000")
public class RecruiterController {

    @Autowired
    private RecruiterRepository recruiterRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getRecruiterByUserId(@PathVariable Long userId) {
        Recruiter recruiter = recruiterRepository.findByUserId(userId).orElse(null);
        if (recruiter == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(recruiter);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRecruiterById(@PathVariable Long id) {
        Recruiter recruiter = recruiterRepository.findById(id).orElse(null);
        if (recruiter == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(recruiter);
    }
}