package grp.projet.controllers;

import grp.projet.DTOs.StudentProfileResponse;
import grp.projet.DTOs.UpdateStudentProfileRequest;
import grp.projet.services.StudentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    private final StudentService student_service;

    public StudentController(StudentService student_service) {
        this.student_service = student_service;
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
}