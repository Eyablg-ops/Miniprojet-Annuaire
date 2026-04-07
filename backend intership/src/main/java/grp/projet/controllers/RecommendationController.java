package grp.projet.controllers;

import grp.projet.entities.*;
import grp.projet.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recommendation")
@CrossOrigin(origins = "http://localhost:3000")
public class RecommendationController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private SkillRepository skillRepository;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentForRecommendation(@PathVariable Long studentId) {
        try {
            Student student = studentRepository.findById(studentId).orElse(null);

            if (student == null) {
                return ResponseEntity.notFound().build();
            }

            // Return the student directly (Jackson will handle serialization)
            return ResponseEntity.ok(student);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching student: " + e.getMessage());
        }
    }

    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents() {
        try {
            List<Student> students = studentRepository.findAll();

            // Load skills for each student
            for (Student student : students) {
                List<Skill> skills = skillRepository.findByStudentId(student.getId());
                student.setSkills(skills);
            }

            return ResponseEntity.ok(students);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching students: " + e.getMessage());
        }
    }

    @GetMapping("/internships")
    public ResponseEntity<?> getAllInternships() {
        try {
            List<Internship> internships = internshipRepository.findAll();
            return ResponseEntity.ok(internships);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching internships: " + e.getMessage());
        }
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<?> getCompanyForRecommendation(@PathVariable Long companyId) {
        try {
            Company company = companyRepository.findById(companyId).orElse(null);
            if (company == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(company);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching company: " + e.getMessage());
        }
    }

    @GetMapping("/companies")
    public ResponseEntity<?> getAllCompanies() {
        try {
            List<Company> companies = companyRepository.findAll();
            return ResponseEntity.ok(companies);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching companies: " + e.getMessage());
        }
    }

    @GetMapping("/recruiter/{recruiterId}/company")
    public ResponseEntity<?> getCompanyByRecruiter(@PathVariable Long recruiterId) {
        try {
            Recruiter recruiter = recruiterRepository.findById(recruiterId).orElse(null);

            if (recruiter != null && recruiter.getCompany() != null) {
                return ResponseEntity.ok(recruiter.getCompany());
            }

            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching company: " + e.getMessage());
        }
    }
}