package grp.projet.repositories;

import grp.projet.entities.Company;
import grp.projet.entities.CompanyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByName(String name);
    // Recherche par nom (insensible à la casse)
    List<Company> findByNameContainingIgnoreCase(String name);

    // Filtrer par ville
    List<Company> findByCity(String city);

    // Filtrer par statut
    List<Company> findByStatus(CompanyStatus status);

    // Recherche nom + ville combinés
    List<Company> findByNameContainingIgnoreCaseAndCity(
            String name, String city
    );

    // Stats — compter par ville
    @Query("SELECT c.city, COUNT(c) FROM Company c GROUP BY c.city")
    List<Object[]> countByCity();

    // Stats — compter par statut
    @Query("SELECT c.status, COUNT(c) FROM Company c GROUP BY c.status")
    List<Object[]> countByStatus();

    long countByStatus(CompanyStatus status);
}