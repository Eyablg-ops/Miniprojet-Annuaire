package grp.projet.services;

import grp.projet.DTOs.StudentProfileResponse;
import grp.projet.DTOs.UpdateStudentProfileRequest;
import grp.projet.entities.Student;
import grp.projet.entities.User;
import grp.projet.repositories.StudentRepository;
import grp.projet.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    private final StudentRepository student_repository;
    private final UserRepository user_repository;

    public StudentService(StudentRepository student_repository,
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

    public StudentProfileResponse getProfile() {
        Student student = get_current_student();

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

    public StudentProfileResponse updateProfile(UpdateStudentProfileRequest request) {
        Student student = get_current_student();

        student.setFirstName(request.getFirst_name());
        student.setLastName(request.getLast_name());
        student.setPhone(request.getPhone());
        student.setAddress(request.getAddress());
        student.setEducationLevel(request.getEducation_level());
        student.setMajor(request.getMajor());
        student.setUniversity(request.getUniversity());
        student.setGraduationYear(request.getGraduation_year());
        student.setProfilePicture(request.getProfile_picture());

        if (request.getDate_of_birth() != null && !request.getDate_of_birth().isBlank()) {
            student.setDateOfBirth(java.sql.Date.valueOf(request.getDate_of_birth()).toLocalDate());
        }

        student_repository.save(student);

        return getProfile();
    }
}