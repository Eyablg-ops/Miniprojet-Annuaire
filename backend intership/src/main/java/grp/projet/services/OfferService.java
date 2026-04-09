package grp.projet.services;

import grp.projet.entities.Company;
import grp.projet.entities.Offer;
import grp.projet.entities.OfferStatus;
import grp.projet.repositories.CompanyRepository;
import grp.projet.repositories.OfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OfferService {

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private CompanyRepository companyRepository;

    public List<Offer> getAllOpen() {
        return offerRepository.findByStatus(OfferStatus.OPEN);
    }

    public List<Offer> getByCompany(Long companyId) {
        return offerRepository.findByCompanyId(companyId);
    }

    public Offer getById(Long id) {
        return offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer not found"));
    }

    public Offer create(Offer offer) {
        // s'assurer que la company existe
      Company company = companyRepository.findById(offer.getCompany().getId())
                .orElseThrow(() -> new RuntimeException("Company not found"));
        offer.setCompany(company);
        return offerRepository.save(offer);
    }

    public Offer update(Long id, Offer updated) {
        Offer offer = getById(id);
        offer.setTitle(updated.getTitle());
        offer.setDescription(updated.getDescription());
        offer.setDomain(updated.getDomain());
        offer.setLocation(updated.getLocation());
        offer.setDuration(updated.getDuration());
        offer.setType(updated.getType());
        offer.setRequiredSkills(updated.getRequiredSkills());
        offer.setStatus(updated.getStatus());
        offer.setDeadline(updated.getDeadline());
        return offerRepository.save(offer);
    }

    public void delete(Long id) {
        offerRepository.deleteById(id);
    }

    public List<Offer> search(String title , String domain, String location, String type) {
        return offerRepository.findByStatus(OfferStatus.OPEN).stream()
                .filter(o -> title == null || (o.getTitle() != null && o.getTitle().toLowerCase().contains(title.toLowerCase())))
                .filter(o -> domain == null || (o.getDomain() != null && o.getDomain().toLowerCase().contains(domain.toLowerCase())))
                .filter(o -> location == null || (o.getLocation() != null && o.getLocation().toLowerCase().contains(location.toLowerCase())))
                .filter(o -> type == null || (o.getType() != null && o.getType().equalsIgnoreCase(type)))
                .collect(Collectors.toList());
    }
}