package grp.projet.controllers;

import grp.projet.entities.Enseignant;
import grp.projet.entities.User;
import grp.projet.repositories.EnseignantRepository;
import grp.projet.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enseignants")
@CrossOrigin(origins = "http://localhost:3000")
public class EnseignantController {

    @Autowired
    private EnseignantRepository enseignantRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentEnseignant(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        Enseignant enseignant = enseignantRepository.findByUserId(user.getId()).orElse(null);
        if (enseignant == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(enseignant);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getEnseignantByUserId(@PathVariable Long userId) {
        Enseignant enseignant = enseignantRepository.findByUserId(userId).orElse(null);
        if (enseignant == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(enseignant);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getEnseignantByEmail(@PathVariable String email) {
        Enseignant enseignant = enseignantRepository.findByUserEmail(email).orElse(null);
        if (enseignant == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(enseignant);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Enseignant enseignantDetails, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        Enseignant enseignant = enseignantRepository.findByUserId(user.getId()).orElse(null);
        if (enseignant == null) {
            return ResponseEntity.notFound().build();
        }

        enseignant.setFirstName(enseignantDetails.getFirstName());
        enseignant.setLastName(enseignantDetails.getLastName());
        enseignant.setPhone(enseignantDetails.getPhone());
        enseignant.setDepartment(enseignantDetails.getDepartment());
        enseignant.setSpecialization(enseignantDetails.getSpecialization());
        enseignant.setOffice(enseignantDetails.getOffice());

        Enseignant updated = enseignantRepository.save(enseignant);
        return ResponseEntity.ok(updated);
    }
}