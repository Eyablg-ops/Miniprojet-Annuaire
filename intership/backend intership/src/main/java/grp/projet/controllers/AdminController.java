package grp.projet.controllers;

import grp.projet.entities.*;
import grp.projet.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private PostulationRepository postulationRepository;

    // ==================== USER MANAGEMENT ====================

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();

            List<Map<String, Object>> userList = users.stream().map(user -> {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", user.getId());
                userMap.put("email", user.getEmail());
                userMap.put("userType", user.getUserType().toString());
                userMap.put("isActive", user.getIsActive());
                userMap.put("active", user.getIsActive());
                userMap.put("createdAt", user.getCreatedAt());
                userMap.put("updatedAt", user.getUpdatedAt());

                // Add student details if exists
                if (user.getStudent() != null) {
                    Map<String, Object> studentMap = new HashMap<>();
                    studentMap.put("id", user.getStudent().getId());
                    studentMap.put("firstName", user.getStudent().getFirstName());
                    studentMap.put("lastName", user.getStudent().getLastName());
                    studentMap.put("major", user.getStudent().getMajor());
                    studentMap.put("university", user.getStudent().getUniversity());
                    userMap.put("student", studentMap);
                }

                // Add recruiter details if exists
                if (user.getRecruiter() != null) {
                    Map<String, Object> recruiterMap = new HashMap<>();
                    recruiterMap.put("id", user.getRecruiter().getId());
                    recruiterMap.put("firstName", user.getRecruiter().getFirstName());
                    recruiterMap.put("lastName", user.getRecruiter().getLastName());
                    recruiterMap.put("position", user.getRecruiter().getPosition());
                    if (user.getRecruiter().getCompany() != null) {
                        Map<String, Object> companyMap = new HashMap<>();
                        companyMap.put("id", user.getRecruiter().getCompany().getId());
                        companyMap.put("name", user.getRecruiter().getCompany().getName());
                        recruiterMap.put("company", companyMap);
                    }
                    userMap.put("recruiter", recruiterMap);
                }

                return userMap;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(userList);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching users: " + e.getMessage());
        }
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("email", user.getEmail());
            userMap.put("userType", user.getUserType().toString());
            userMap.put("isActive", user.getIsActive());
            userMap.put("createdAt", user.getCreatedAt());
            userMap.put("updatedAt", user.getUpdatedAt());

            if (user.getStudent() != null) {
                Map<String, Object> studentMap = new HashMap<>();
                studentMap.put("id", user.getStudent().getId());
                studentMap.put("firstName", user.getStudent().getFirstName());
                studentMap.put("lastName", user.getStudent().getLastName());
                studentMap.put("phone", user.getStudent().getPhone());
                studentMap.put("address", user.getStudent().getAddress());
                studentMap.put("major", user.getStudent().getMajor());
                studentMap.put("university", user.getStudent().getUniversity());
                studentMap.put("educationLevel", user.getStudent().getEducationLevel());
                studentMap.put("graduationYear", user.getStudent().getGraduationYear());
                userMap.put("student", studentMap);
            }

            if (user.getRecruiter() != null) {
                Map<String, Object> recruiterMap = new HashMap<>();
                recruiterMap.put("id", user.getRecruiter().getId());
                recruiterMap.put("firstName", user.getRecruiter().getFirstName());
                recruiterMap.put("lastName", user.getRecruiter().getLastName());
                recruiterMap.put("position", user.getRecruiter().getPosition());
                recruiterMap.put("phone", user.getRecruiter().getPhone());
                if (user.getRecruiter().getCompany() != null) {
                    Map<String, Object> companyMap = new HashMap<>();
                    companyMap.put("id", user.getRecruiter().getCompany().getId());
                    companyMap.put("name", user.getRecruiter().getCompany().getName());
                    companyMap.put("city", user.getRecruiter().getCompany().getCity());
                    recruiterMap.put("company", companyMap);
                }
                userMap.put("recruiter", recruiterMap);
            }

            return ResponseEntity.ok(userMap);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching user: " + e.getMessage());
        }
    }

    @GetMapping("/users/stats")
    public ResponseEntity<?> getUserStats() {
        try {
            long totalUsers = userRepository.count();
            long totalStudents = userRepository.countByUserType(UserType.STUDENT);
            long totalRecruiters = userRepository.countByUserType(UserType.RECRUITER);
            long totalAdmins = userRepository.countByUserType(UserType.ADMIN);
            long activeUsers = userRepository.countByIsActiveTrue();

            Map<String, Object> stats = new HashMap<>();
            stats.put("total", totalUsers);
            stats.put("students", totalStudents);
            stats.put("recruiters", totalRecruiters);
            stats.put("admins", totalAdmins);
            stats.put("active", activeUsers);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching stats: " + e.getMessage());
        }
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            User user = userRepository.findById(id).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            String status = body.get("status");
            boolean isActive = "ACTIVE".equalsIgnoreCase(status);
            user.setIsActive(isActive);
            userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("active", user.getIsActive());
            response.put("message", "User status updated successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating user status: " + e.getMessage());
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            // Don't allow deleting the last admin
            if (user.getUserType() == UserType.ADMIN) {
                long adminCount = userRepository.countByUserType(UserType.ADMIN);
                if (adminCount <= 1) {
                    return ResponseEntity.badRequest().body("Cannot delete the last admin user");
                }
            }

            userRepository.delete(user);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting user: " + e.getMessage());
        }
    }

    // ==================== COMPANY MANAGEMENT ====================

    @GetMapping("/companies")
    public ResponseEntity<?> getAllCompanies() {
        try {
            List<Company> companies = companyRepository.findAll();
            return ResponseEntity.ok(companies);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching companies: " + e.getMessage());
        }
    }

    @GetMapping("/companies/{id}")
    public ResponseEntity<?> getCompanyById(@PathVariable Long id) {
        try {
            Company company = companyRepository.findById(id).orElse(null);
            if (company == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(company);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching company: " + e.getMessage());
        }
    }

    @GetMapping("/companies/stats")
    public ResponseEntity<?> getCompanyStats() {
        try {
            long totalCompanies = companyRepository.count();
            long activeCompanies = companyRepository.countByStatus(CompanyStatus.ACTIVE);
            long inactiveCompanies = companyRepository.countByStatus(CompanyStatus.INACTIVE);

            Map<String, Object> stats = new HashMap<>();
            stats.put("total", totalCompanies);
            stats.put("active", activeCompanies);
            stats.put("inactive", inactiveCompanies);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching company stats: " + e.getMessage());
        }
    }

    @PostMapping("/companies")
    public ResponseEntity<?> createCompany(@RequestBody Company company) {
        try {
            Company savedCompany = companyRepository.save(company);
            return ResponseEntity.ok(savedCompany);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error creating company: " + e.getMessage());
        }
    }

    @PutMapping("/companies/{id}")
    public ResponseEntity<?> updateCompany(@PathVariable Long id, @RequestBody Company companyDetails) {
        try {
            Company company = companyRepository.findById(id).orElse(null);
            if (company == null) {
                return ResponseEntity.notFound().build();
            }

            company.setName(companyDetails.getName());
            company.setCity(companyDetails.getCity());
            company.setCountry(companyDetails.getCountry());
            company.setDescription(companyDetails.getDescription());
            company.setServices(companyDetails.getServices());
            company.setWebsite(companyDetails.getWebsite());
            company.setStatus(companyDetails.getStatus());

            Company updatedCompany = companyRepository.save(company);
            return ResponseEntity.ok(updatedCompany);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating company: " + e.getMessage());
        }
    }

    @DeleteMapping("/companies/{id}")
    public ResponseEntity<?> deleteCompany(@PathVariable Long id) {
        try {
            Company company = companyRepository.findById(id).orElse(null);
            if (company == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if company has offers
            List<Offer> offers = offerRepository.findByCompanyId(id);
            if (!offers.isEmpty()) {
                return ResponseEntity.badRequest().body("Cannot delete company with existing offers");
            }

            companyRepository.delete(company);
            return ResponseEntity.ok(Map.of("message", "Company deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting company: " + e.getMessage());
        }
    }

    // ==================== DASHBOARD STATS ====================

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", userRepository.count());
            stats.put("totalStudents", userRepository.countByUserType(UserType.STUDENT));
            stats.put("totalRecruiters", userRepository.countByUserType(UserType.RECRUITER));
            stats.put("totalCompanies", companyRepository.count());
            stats.put("totalOffers", offerRepository.count());
            stats.put("totalApplications", postulationRepository.count());
            stats.put("activeCompanies", companyRepository.countByStatus(CompanyStatus.ACTIVE));
            stats.put("activeUsers", userRepository.countByIsActiveTrue());

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching dashboard stats: " + e.getMessage());
        }
    }
}