package com.internship.annuaireservice.controller;
import com.internship.annuaireservice.entity.AnnuaireCompany;
import com.internship.annuaireservice.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/annuaire")
//autorise React (port 3000) à appeler notre API (port 8082)
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService service;

    // ── GET toutes les entreprises + recherche ────────────────
    // URL : GET http://localhost:8082/api/annuaire/companies
    // URL : GET http://localhost:8082/api/annuaire/companies?name=Zeta
    // URL : GET http://localhost:8082/api/annuaire/companies?city=Tunis
    @GetMapping("/companies")
    public ResponseEntity<List<AnnuaireCompany>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String city) {
        return ResponseEntity.ok(service.search(name, city));
    }

    // ── GET une entreprise par ID ─────────────────────────────
    // URL : GET http://localhost:8082/api/annuaire/companies/1
    @GetMapping("/companies/{id}")
    public ResponseEntity<AnnuaireCompany> getById(
            @PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── POST créer une entreprise ─────────────────────────────
    // URL : POST http://localhost:8082/api/annuaire/companies
    @PostMapping("/companies")
    public ResponseEntity<AnnuaireCompany> create(
            @RequestBody AnnuaireCompany company) {
        AnnuaireCompany created = service.create(company);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);
    }

    // ── PUT modifier une entreprise ───────────────────────────
    // URL : PUT http://localhost:8082/api/annuaire/companies/1
    @PutMapping("/companies/{id}")
    public ResponseEntity<AnnuaireCompany> update(
            @PathVariable Long id,
            @RequestBody AnnuaireCompany company) {
        return service.update(id, company)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── DELETE supprimer une entreprise ──────────────────────
    // URL : DELETE http://localhost:8082/api/annuaire/companies/1
    @DeleteMapping("/companies/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.delete(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    // ── GET statistiques ──────────────────────────────────────
    // URL : GET http://localhost:8082/api/annuaire/stats
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(service.getStats());
    }
}