package grp.projet.repositories;

import grp.projet.entities.Postulation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostulationRepository extends JpaRepository<Postulation, Long> {
    List<Postulation> findByStudentId(Long studentId);
    List<Postulation> findByOfferId(Long offerId);
    boolean existsByStudentIdAndOfferId(Long studentId, Long offerId);
}