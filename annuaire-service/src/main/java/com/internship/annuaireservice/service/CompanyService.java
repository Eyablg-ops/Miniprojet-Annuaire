package com.internship.annuaireservice.service;
import com.internship.annuaireservice.entity.AnnuaireCompany;
import com.internship.annuaireservice.repository.AnnuaireCompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final AnnuaireCompanyRepository repo;

    // ── Lire toutes les entreprises ───────────────────────────
    public List<AnnuaireCompany> getAll() {
        return repo.findAll();
    }

    // ── Lire une entreprise par ID ────────────────────────────
    public Optional<AnnuaireCompany> getById(Long id) {
        return repo.findById(id);
    }

    // ── Recherche avec filtres ────────────────────────────────
    public List<AnnuaireCompany> search(String name, String city) {
        if (name != null && !name.isEmpty() &&
                city != null && !city.isEmpty()) {
            return repo.findByNameContainingIgnoreCaseAndCity(name, city);
        } else if (name != null && !name.isEmpty()) {
            return repo.findByNameContainingIgnoreCase(name);
        } else if (city != null && !city.isEmpty()) {
            return repo.findByCity(city);
        }
        return repo.findAll();
    }

    // ── Créer une entreprise ──────────────────────────────────
    public AnnuaireCompany create(AnnuaireCompany company) {
        return repo.save(company);
    }

    // ── Modifier une entreprise ───────────────────────────────
    public Optional<AnnuaireCompany> update(Long id,
                                            AnnuaireCompany updated) {
        return repo.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setCity(updated.getCity());
            existing.setDescription(updated.getDescription());
            existing.setServices(updated.getServices());
            existing.setWebsite(updated.getWebsite());
            existing.setStatus(updated.getStatus());
            return repo.save(existing);
        });
    }

    // ── Supprimer une entreprise ──────────────────────────────
    public boolean delete(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }

    // ── Statistiques ──────────────────────────────────────────
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();

        // Total entreprises
        stats.put("total", repo.count());

        // Par ville
        List<Object[]> byCity = repo.countByCity();
        Map<String, Long> cityMap = new LinkedHashMap<>();
        for (Object[] row : byCity) {
            cityMap.put((String) row[0], (Long) row[1]);
        }
        stats.put("byCity", cityMap);

        // Par statut
        List<Object[]> byStatus = repo.countByStatus();
        Map<String, Long> statusMap = new LinkedHashMap<>();
        for (Object[] row : byStatus) {
            statusMap.put(row[0].toString(), (Long) row[1]);
        }
        stats.put("byStatus", statusMap);

        return stats;
    }
}