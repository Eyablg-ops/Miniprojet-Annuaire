package com.internship.annuaireservice.repository;
import com.internship.annuaireservice.entity.AnnuaireCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnnuaireCompanyRepository
        extends JpaRepository<AnnuaireCompany, Long> {

    // Recherche par nom (insensible à la casse)
    List<AnnuaireCompany> findByNameContainingIgnoreCase(String name);

    // Filtrer par ville
    List<AnnuaireCompany> findByCity(String city);

    // Filtrer par statut
    List<AnnuaireCompany> findByStatus(AnnuaireCompany.CompanyStatus status);

    // Recherche nom + ville combinés
    List<AnnuaireCompany> findByNameContainingIgnoreCaseAndCity(
            String name, String city
    );

    // Stats — compter par ville
    @Query("SELECT c.city, COUNT(c) FROM AnnuaireCompany c GROUP BY c.city")
    List<Object[]> countByCity();

    // Stats — compter par statut
    @Query("SELECT c.status, COUNT(c) FROM AnnuaireCompany c GROUP BY c.status")
    List<Object[]> countByStatus();
}
