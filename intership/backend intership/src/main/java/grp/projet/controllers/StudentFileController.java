package grp.projet.controllers;

import grp.projet.DTOs.StudentProfileResponse;
import grp.projet.services.StudentFileService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;

@RestController
@RequestMapping("/api/student")
public class StudentFileController {

    private final StudentFileService student_file_service;

    public StudentFileController(StudentFileService student_file_service) {
        this.student_file_service = student_file_service;
    }

    @PostMapping(value = "/upload-cv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public StudentProfileResponse upload_cv(@RequestParam("file") MultipartFile file) {
        return student_file_service.upload_cv(file);
    }

    @PostMapping(value = "/upload-profile-picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public StudentProfileResponse upload_profile_picture(@RequestParam("file") MultipartFile file) {
        return student_file_service.upload_profile_picture(file);
    }

    @GetMapping("/cv")
    public ResponseEntity<Resource> download_my_cv() {
        Resource resource = student_file_service.get_current_student_cv_resource();
        String file_name = student_file_service.get_current_student_cv_file_name();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file_name + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }
    @GetMapping("/profile-picture")
    public ResponseEntity<Resource> get_my_profile_picture() {
        Resource resource = student_file_service.get_current_student_profile_picture_resource();
        String file_name = student_file_service.get_current_student_profile_picture_file_name();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file_name + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}