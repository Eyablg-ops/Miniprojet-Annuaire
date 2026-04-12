package grp.projet.services;

import grp.projet.DTOs.StudentProfileResponse;
import grp.projet.entities.Student;
import grp.projet.entities.User;
import grp.projet.repositories.StudentRepository;
import grp.projet.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import java.net.MalformedURLException;
@Service
public class StudentFileService {

    private final StudentRepository student_repository;
    private final UserRepository user_repository;

    public StudentFileService(StudentRepository student_repository,
                              UserRepository user_repository) {
        this.student_repository = student_repository;
        this.user_repository = user_repository;
    }

    private String get_current_user_email() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        return authentication.getName();
    }

    private User get_current_user() {
        String email = get_current_user_email();

        return user_repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Student get_current_student() {
        User user = get_current_user();

        return student_repository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    private StudentProfileResponse map_to_response(Student student) {
        return StudentProfileResponse.builder()
                .id(student.getId())
                .first_name(student.getFirstName())
                .last_name(student.getLastName())
                .email(student.getUser().getEmail())
                .phone(student.getPhone())
                .address(student.getAddress())
                .date_of_birth(student.getDateOfBirth() != null
                        ? student.getDateOfBirth().toString()
                        : null)
                .education_level(student.getEducationLevel())
                .major(student.getMajor())
                .university(student.getUniversity())
                .graduation_year(student.getGraduationYear())
                .cv_path(student.getCvPath())
                .profile_picture(student.getProfilePicture())
                .build();
    }

    private String save_file(MultipartFile file, String folder_name) {
        try {
            if (file == null || file.isEmpty()) {
                throw new RuntimeException("File is empty");
            }

            String original_filename = file.getOriginalFilename();
            String extension = "";

            if (original_filename != null && original_filename.contains(".")) {
                extension = original_filename.substring(original_filename.lastIndexOf("."));
            }

            String generated_filename = UUID.randomUUID() + extension;

            Path upload_path = Paths.get("uploads", folder_name);
            Files.createDirectories(upload_path);

            Path file_path = upload_path.resolve(generated_filename);
            Files.copy(file.getInputStream(), file_path, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + folder_name + "/" + generated_filename;

        } catch (IOException exception) {
            throw new RuntimeException("Failed to save file", exception);
        }
    }

    public StudentProfileResponse upload_cv(MultipartFile file) {
        Student student = get_current_student();

        String stored_path = save_file(file, "cv");
        student.setCvPath(stored_path);

        student_repository.save(student);

        return map_to_response(student);
    }

    public StudentProfileResponse upload_profile_picture(MultipartFile file) {
        Student student = get_current_student();

        String stored_path = save_file(file, "profile-pictures");
        student.setProfilePicture(stored_path);

        student_repository.save(student);

        return map_to_response(student);
    }
    public Resource get_current_student_cv_resource() {
        try {
            Student student = get_current_student();

            if (student.getCvPath() == null || student.getCvPath().isBlank()) {
                throw new RuntimeException("No CV uploaded");
            }

            String relative_path = student.getCvPath().replaceFirst("^/", "");
            Path file_path = Paths.get(relative_path).toAbsolutePath().normalize();

            Resource resource = new UrlResource(file_path.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("CV file not found or unreadable");
            }

            return resource;
        } catch (MalformedURLException exception) {
            throw new RuntimeException("Failed to load CV file", exception);
        }
    }

    public String get_current_student_cv_file_name() {
        Student student = get_current_student();

        if (student.getCvPath() == null || student.getCvPath().isBlank()) {
            throw new RuntimeException("No CV uploaded");
        }

        Path file_name = Paths.get(student.getCvPath()).getFileName();
        return file_name != null ? file_name.toString() : "cv";
    }

    public Resource get_current_student_profile_picture_resource() {
        try {
            Student student = get_current_student();

            if (student.getProfilePicture() == null || student.getProfilePicture().isBlank()) {
                throw new RuntimeException("No profile picture uploaded");
            }

            String relative_path = student.getProfilePicture().replaceFirst("^/", "");
            Path file_path = Paths.get(relative_path).toAbsolutePath().normalize();

            Resource resource = new UrlResource(file_path.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("Profile picture file not found or unreadable");
            }

            return resource;
        } catch (MalformedURLException exception) {
            throw new RuntimeException("Failed to load profile picture", exception);
        }
    }

    public String get_current_student_profile_picture_file_name() {
        Student student = get_current_student();

        if (student.getProfilePicture() == null || student.getProfilePicture().isBlank()) {
            throw new RuntimeException("No profile picture uploaded");
        }

        Path file_name = Paths.get(student.getProfilePicture()).getFileName();
        return file_name != null ? file_name.toString() : "profile-picture";
    }
}