package grp.projet.config;

import grp.projet.entities.*;
import grp.projet.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@internplatform.com")) {
            User adminUser = new User();
            adminUser.setEmail("admin@internplatform.com");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setUserType(UserType.ADMIN);
            adminUser.setIsActive(true);
            adminUser = userRepository.save(adminUser);

            Admin admin = new Admin();
            admin.setUser(adminUser);
            admin.setFirstName("Super");
            admin.setLastName("Admin");
            admin.setPhone("+21612345678");
            admin.setIsSuperAdmin(true);
            adminRepository.save(admin);

            System.out.println("Default admin created: admin@internplatform.com / Admin@123");
        }
    }
}