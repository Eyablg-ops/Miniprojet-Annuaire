package grp.projet.repositories;

import grp.projet.entities.User;
import grp.projet.entities.UserType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    long countByUserType(UserType userType);
    long countByIsActiveTrue();
}