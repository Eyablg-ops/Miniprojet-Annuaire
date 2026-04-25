package grp.projet.services;

import grp.projet.DTOs.EnseignantRegisterRequest;
import grp.projet.DTOs.LoginRequest;
import grp.projet.DTOs.RecruiterRegisterRequest;
import grp.projet.DTOs.StudentRegisterRequest;
import grp.projet.repositories.*;
import grp.projet.securite.AuthResponse;
import grp.projet.entities.*;
import grp.projet.securite.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private EnseignantRepository enseignantRepository;

    @Autowired
    private CompanyRepository annuaireCompanyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Transactional
    public AuthResponse registerStudent(StudentRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUserType(UserType.STUDENT);
        user = userRepository.save(user);

        Student student = new Student();
        student.setUser(user);
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setPhone(request.getPhone());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setAddress(request.getAddress());
        student.setEducationLevel(request.getEducationLevel());
        student.setMajor(request.getMajor());
        student.setUniversity(request.getUniversity());
        student.setGraduationYear(request.getGraduationYear());
        student = studentRepository.save(student);

        String token = jwtService.authenticateAndGenerateToken(request.getEmail(), request.getPassword(), "STUDENT");

        return new AuthResponse(token, "STUDENT", user.getId(), user.getEmail());
    }

    @Transactional
    public AuthResponse registerRecruiter(RecruiterRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        Company company = annuaireCompanyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUserType(UserType.RECRUITER);
        user = userRepository.save(user);

        Recruiter recruiter = new Recruiter();
        recruiter.setUser(user);
        recruiter.setCompany(company);
        recruiter.setFirstName(request.getFirstName());
        recruiter.setLastName(request.getLastName());
        recruiter.setPosition(request.getPosition());
        recruiter.setPhone(request.getPhone());
        recruiter = recruiterRepository.save(recruiter);

        String token = jwtService.authenticateAndGenerateToken(request.getEmail(), request.getPassword(), "RECRUITER");

        return new AuthResponse(token, "RECRUITER", user.getId(), user.getEmail());
    }

    @Transactional
    public AuthResponse registerEnseignant(EnseignantRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUserType(UserType.ENSEIGNANT);
        user = userRepository.save(user);

        Enseignant enseignant = new Enseignant();
        enseignant.setUser(user);
        enseignant.setFirstName(request.getFirstName());
        enseignant.setLastName(request.getLastName());
        enseignant.setPhone(request.getPhone());
        enseignant.setDepartment(request.getDepartment());
        enseignant.setSpecialization(request.getSpecialization());
        enseignant.setOffice(request.getOffice());
        enseignant = enseignantRepository.save(enseignant);

        String token = jwtService.authenticateAndGenerateToken(request.getEmail(), request.getPassword(), "ENSEIGNANT");

        return new AuthResponse(token, "ENSEIGNANT", user.getId(), user.getEmail());
    }

    public AuthResponse adminLogin(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (user.getUserType() != UserType.ADMIN) {
            throw new RuntimeException("Access denied. Admin privileges required.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("Account is disabled");
        }

        String token = jwtService.authenticateAndGenerateToken(
                request.getEmail(),
                request.getPassword(),
                user.getUserType().toString()
        );

        return new AuthResponse(token, "ADMIN", user.getId(), user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("Account is disabled");
        }

        String token = jwtService.authenticateAndGenerateToken(
                request.getEmail(),
                request.getPassword(),
                user.getUserType().toString()
        );

        return new AuthResponse(token, user.getUserType().toString(), user.getId(), user.getEmail());
    }
}