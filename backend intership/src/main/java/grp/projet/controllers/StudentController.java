package grp.projet.controllers;

import grp.projet.entities.Skill;
import grp.projet.entities.SkillLevel;
import grp.projet.entities.Student;
import grp.projet.repositories.SkillRepository;
import grp.projet.repositories.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SkillRepository skillRepository;

    // Add endpoint to get student by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getStudentByUserId(@PathVariable Long userId) {
        Student student = studentRepository.findByUserId(userId).orElse(null);
        if (student == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(student);
    }

    // Add endpoint to get student by email
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getStudentByEmail(@PathVariable String email) {
        Student student = studentRepository.findByUserEmail(email).orElse(null);
        if (student == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(student);
    }

    // Add skills to student
    @PostMapping("/{studentId}/skills")
    public ResponseEntity<?> addSkills(@PathVariable Long studentId, @RequestBody Map<String, Object> request) {
        try {
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            List<Map<String, String>> skillsList = (List<Map<String, String>>) request.get("skills");

            for (Map<String, String> skillData : skillsList) {
                Skill skill = new Skill();
                skill.setStudent(student);
                skill.setSkillName(skillData.get("skillName"));

                String level = skillData.get("skillLevel");
                if (level != null) {
                    skill.setSkillLevel(SkillLevel.valueOf(level.toUpperCase()));
                }

                skillRepository.save(skill);
            }

            return ResponseEntity.ok("Skills added successfully");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error adding skills: " + e.getMessage());
        }
    }

    // Get student skills
    @GetMapping("/{studentId}/skills")
    public ResponseEntity<List<Skill>> getStudentSkills(@PathVariable Long studentId) {
        List<Skill> skills = skillRepository.findByStudentId(studentId);
        return ResponseEntity.ok(skills);
    }

    // Update student profile
    @PutMapping("/{studentId}/profile")
    public ResponseEntity<?> updateStudentProfile(@PathVariable Long studentId, @RequestBody Student studentDetails) {
        try {
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            student.setFirstName(studentDetails.getFirstName());
            student.setLastName(studentDetails.getLastName());
            student.setPhone(studentDetails.getPhone());
            student.setAddress(studentDetails.getAddress());
            student.setMajor(studentDetails.getMajor());
            student.setUniversity(studentDetails.getUniversity());
            student.setEducationLevel(studentDetails.getEducationLevel());
            student.setGraduationYear(studentDetails.getGraduationYear());

            Student updatedStudent = studentRepository.save(student);
            return ResponseEntity.ok(updatedStudent);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating profile: " + e.getMessage());
        }
    }
}