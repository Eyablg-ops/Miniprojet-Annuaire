package grp.projet.repositories;

import grp.projet.entities.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EnseignantRepository extends JpaRepository<Enseignant, Long> {
    Optional<Enseignant> findByUserId(Long userId);
    Optional<Enseignant> findByUserEmail(String email);
}