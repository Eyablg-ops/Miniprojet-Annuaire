package grp.projet.services;

import grp.projet.DTOs.InternshipHistoryRequest;
import grp.projet.DTOs.InternshipHistoryResponse;
import grp.projet.entities.InternshipHistory;
import grp.projet.entities.Student;
import grp.projet.entities.User;
import grp.projet.repositories.InternshipHistoryRepository;
import grp.projet.repositories.StudentRepository;
import grp.projet.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class InternshipHistoryService {

    private final InternshipHistoryRepository internship_history_repository;
    private final StudentRepository student_repository;
    private final UserRepository user_repository;

    public InternshipHistoryService(
            InternshipHistoryRepository internship_history_repository,
            StudentRepository student_repository,
            UserRepository user_repository
    ) {
        this.internship_history_repository = internship_history_repository;
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

    private InternshipHistoryResponse map_to_response(InternshipHistory internship) {
        return InternshipHistoryResponse.builder()
                .id(internship.getId())
                .company_name(internship.getCompanyName())
                .position(internship.getPosition())
                .description(internship.getDescription())
                .start_date(
                        internship.getStartDate() != null
                                ? internship.getStartDate().toString()
                                : null
                )
                .end_date(
                        internship.getEndDate() != null
                                ? internship.getEndDate().toString()
                                : null
                )
                .report_path(internship.getReportPath())
                .build();
    }

    public List<InternshipHistoryResponse> get_my_internships() {
        Student student = get_current_student();

        return internship_history_repository.findByStudentId(student.getId())
                .stream()
                .map(this::map_to_response)
                .toList();
    }

    public InternshipHistoryResponse add_internship(InternshipHistoryRequest request) {
        Student student = get_current_student();

        InternshipHistory internship = new InternshipHistory();
        internship.setStudent(student);
        internship.setCompanyName(request.getCompany_name());
        internship.setPosition(request.getPosition());
        internship.setDescription(request.getDescription());
        internship.setStartDate(LocalDate.parse(request.getStart_date()));
        internship.setEndDate(LocalDate.parse(request.getEnd_date()));

        InternshipHistory saved_internship = internship_history_repository.save(internship);

        return map_to_response(saved_internship);
    }

    public void delete_internship(Long internship_id) {
        Student student = get_current_student();

        InternshipHistory internship = internship_history_repository.findById(internship_id)
                .orElseThrow(() -> new RuntimeException("Internship not found"));

        if (!internship.getStudent().getId().equals(student.getId())) {
            throw new RuntimeException("Unauthorized to delete this internship");
        }

        internship_history_repository.delete(internship);
    }
}