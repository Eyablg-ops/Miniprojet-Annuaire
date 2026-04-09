package grp.projet.repositories;

import grp.projet.entities.InternshipHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InternshipHistoryRepository extends JpaRepository<InternshipHistory, Long> {
    List<InternshipHistory> findByStudentId(Long studentId);
}