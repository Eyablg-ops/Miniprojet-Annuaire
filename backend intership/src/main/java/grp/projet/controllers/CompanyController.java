package grp.projet.controllers;

import grp.projet.entities.Company;
import grp.projet.services.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/annuaire") // pour matcher ton second controller
public class CompanyController {

    @Autowired
    private CompanyService service;

    // ── GET toutes les entreprises + recherche ────────────────
    // URL : GET /api/annuaire/companies
    // URL : GET /api/annuaire/companies?name=Zeta
    // URL : GET /api/annuaire/companies?city=Tunis
    @GetMapping("/companies")
    public ResponseEntity<List<Company>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String city) {
        return ResponseEntity.ok(service.search(name, city));
    }

    // ── GET une entreprise par ID ─────────────────────────────
    // URL : GET /api/annuaire/companies/{id}
    @GetMapping("/companies/{id}")
    public ResponseEntity<Company> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── POST créer une entreprise ─────────────────────────────
    // URL : POST /api/annuaire/companies
    @PostMapping("/companies")
    public ResponseEntity<Company> create(@RequestBody Company company) {
        Company created = service.create(company);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ── PUT modifier une entreprise ───────────────────────────
    // URL : PUT /api/annuaire/companies/{id}
    @PutMapping("/companies/{id}")
    public ResponseEntity<Company> update(@PathVariable Long id,
                                          @RequestBody Company company) {
        return service.updateCompany(id, company)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── DELETE supprimer une entreprise ──────────────────────
    // URL : DELETE /api/annuaire/companies/{id}
    @DeleteMapping("/companies/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.delete(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    // ── GET statistiques ──────────────────────────────────────
    // URL : GET /api/annuaire/stats
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(service.getStats());
    }
}