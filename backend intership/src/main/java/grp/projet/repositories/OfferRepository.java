package grp.projet.repositories;

import grp.projet.entities.Offer;
import grp.projet.entities.OfferStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {
    List<Offer> findByCompanyId(Long companyId);
    List<Offer> findByStatus(OfferStatus status);
    List<Offer> findByDomainContainingIgnoreCase(String domain);
    List<Offer> findByLocationContainingIgnoreCase(String location);
    List<Offer> findByCompanyIdAndStatus(Long companyId, OfferStatus status);
}