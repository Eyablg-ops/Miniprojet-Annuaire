package grp.projet.services;

import grp.projet.entities.Company;
import grp.projet.repositories.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    // ── Lire toutes les entreprises ───────────────────────────
    public List<Company> getAll() {
        return companyRepository.findAll();
    }

    // ── Lire une entreprise par ID ────────────────────────────
    public Optional<Company> getById(Long id) {
        return companyRepository.findById(id);
    }

    // ── Recherche avec filtres ────────────────────────────────
    public List<Company> search(String name, String city) {
        if (name != null && !name.isEmpty() &&
                city != null && !city.isEmpty()) {
            return companyRepository.findByNameContainingIgnoreCaseAndCity(name, city);
        } else if (name != null && !name.isEmpty()) {
            return companyRepository.findByNameContainingIgnoreCase(name);
        } else if (city != null && !city.isEmpty()) {
            return companyRepository.findByCity(city);
        }
        return companyRepository.findAll();
    }

    // ── Créer une entreprise ──────────────────────────────────
    public Company create(Company company) {
        return companyRepository.save(company);
    }

    // ── Modifier une entreprise ───────────────────────────────
    public Optional<Company> updateCompany(Long id, Company updated) {
        return companyRepository.findById(id).map(company -> {
            company.setName(updated.getName());
            company.setCity(updated.getCity());
            company.setCountry(updated.getCountry());
            company.setDescription(updated.getDescription());
            company.setServices(updated.getServices());
            company.setWebsite(updated.getWebsite());
            company.setStatus(updated.getStatus());
            company.setSource(updated.getSource());
            return companyRepository.save(company);
        });
    }

    // ── Supprimer une entreprise ──────────────────────────────
    public boolean delete(Long id) {
        if (companyRepository.existsById(id)) {
            companyRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // ── Statistiques ──────────────────────────────────────────
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();

        // Total entreprises
        stats.put("total", companyRepository.count());

        // Par ville
        List<Object[]> byCity = companyRepository.countByCity();
        Map<String, Long> cityMap = new LinkedHashMap<>();
        for (Object[] row : byCity) {
            cityMap.put((String) row[0], (Long) row[1]);
        }
        stats.put("byCity", cityMap);

        // Par statut
        List<Object[]> byStatus = companyRepository.countByStatus();
        Map<String, Long> statusMap = new LinkedHashMap<>();
        for (Object[] row : byStatus) {
            statusMap.put(row[0].toString(), (Long) row[1]);
        }
        stats.put("byStatus", statusMap);

        return stats;
    }

    // ── Ton update existant original pour compatibilité ───────
    public Company update(Long id, Company updated) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        company.setName(updated.getName());
        company.setCity(updated.getCity());
        company.setCountry(updated.getCountry());
        company.setDescription(updated.getDescription());
        company.setServices(updated.getServices());
        company.setWebsite(updated.getWebsite());
        return companyRepository.save(company);
    }

    // ── Ton getById original pour compatibilité ───────────────
    public Company getByIdOriginal(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
    }
}