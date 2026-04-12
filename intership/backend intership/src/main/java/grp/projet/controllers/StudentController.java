package grp.projet.controllers;

import grp.projet.DTOs.StudentProfileResponse;
import grp.projet.DTOs.UpdateStudentProfileRequest;
import grp.projet.entities.Student;
import grp.projet.repositories.StudentRepository;
import grp.projet.services.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    private final StudentService student_service;
    private final StudentRepository studentRepository;

    public StudentController(StudentService student_service, StudentRepository studentRepository) {
        this.student_service = student_service;
        this.studentRepository = studentRepository;
    }

    @GetMapping("/profile")
    public StudentProfileResponse get_profile() {
        return student_service.getProfile();
    }

    @PutMapping("/profile")
    public StudentProfileResponse update_profile(
            @RequestBody UpdateStudentProfileRequest request) {

        return student_service.updateProfile(request);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getStudentByEmail(@PathVariable String email) {
        Student student = studentRepository.findByUserEmail(email).orElse(null);
        if (student == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(student);
    }
}