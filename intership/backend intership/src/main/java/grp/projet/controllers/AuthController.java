package grp.projet.controllers;

import grp.projet.DTOs.EnseignantRegisterRequest;
import grp.projet.DTOs.LoginRequest;
import grp.projet.DTOs.RecruiterRegisterRequest;
import grp.projet.DTOs.StudentRegisterRequest;
import grp.projet.securite.AuthResponse;
import grp.projet.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/student/register")
    public ResponseEntity<?> registerStudent(@RequestBody StudentRegisterRequest request) {
        try {
            AuthResponse response = authService.registerStudent(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/recruiter/register")
    public ResponseEntity<?> registerRecruiter(@RequestBody RecruiterRegisterRequest request) {
        try {
            AuthResponse response = authService.registerRecruiter(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/enseignant/register")  // Add this
    public ResponseEntity<?> registerEnseignant(@RequestBody EnseignantRegisterRequest request) {
        try {
            AuthResponse response = authService.registerEnseignant(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.adminLogin(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}