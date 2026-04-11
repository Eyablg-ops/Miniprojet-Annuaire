package grp.projet.services;

import grp.projet.DTOs.SkillRequest;
import grp.projet.DTOs.SkillResponse;
import grp.projet.entities.Skill;
import grp.projet.entities.SkillLevel;
import grp.projet.entities.Student;
import grp.projet.entities.User;
import grp.projet.repositories.SkillRepository;
import grp.projet.repositories.StudentRepository;
import grp.projet.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillService {

    private final SkillRepository skill_repository;
    private final StudentRepository student_repository;
    private final UserRepository user_repository;

    public SkillService(
            SkillRepository skill_repository,
            StudentRepository student_repository,
            UserRepository user_repository
    ) {
        this.skill_repository = skill_repository;
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

    private SkillResponse map_to_response(Skill skill) {
        return SkillResponse.builder()
                .id(skill.getId())
                .skill_name(skill.getSkillName())
                .skill_level(skill.getSkillLevel().name())
                .build();
    }

    public List<SkillResponse> get_my_skills() {
        Student student = get_current_student();

        return skill_repository.findByStudentId(student.getId())
                .stream()
                .map(this::map_to_response)
                .toList();
    }

    public SkillResponse add_skill(SkillRequest request) {
        Student student = get_current_student();

        Skill skill = new Skill();
        skill.setSkillName(request.getSkill_name());
        skill.setSkillLevel(SkillLevel.valueOf(request.getSkill_level().toUpperCase()));
        skill.setStudent(student);

        Skill saved_skill = skill_repository.save(skill);

        return map_to_response(saved_skill);
    }

    public void delete_skill(Long skill_id) {
        Student student = get_current_student();

        Skill skill = skill_repository.findById(skill_id)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        if (!skill.getStudent().getId().equals(student.getId())) {
            throw new RuntimeException("Unauthorized to delete this skill");
        }

        skill_repository.delete(skill);
    }
}