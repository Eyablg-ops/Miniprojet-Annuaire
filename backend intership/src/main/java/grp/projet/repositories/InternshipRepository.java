package grp.projet.repositories;

import grp.projet.entities.Company;
import grp.projet.entities.Internship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, Long> {
    List<Internship> findByCompany(Company company);
    List<Internship> findByLocationContainingIgnoreCase(String location);
    List<Internship> findByRequiredSkillsContainingIgnoreCase(String skill);
}