package grp.projet.controllers;

import grp.projet.entities.Offer;
import grp.projet.services.OfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")

public class OfferController {

    @Autowired
    private OfferService offerService;

    // Lister toutes les offres ouvertes (public)
    @GetMapping("/public")
    public List<Offer> getAllOpenOffers() {
        return offerService.getAllOpen();
    }

    // Offres d'une entreprise
    @GetMapping("/company/{companyId}")
    public List<Offer> getByCompany(@PathVariable Long companyId) {
        return offerService.getByCompany(companyId);
    }

    // Détail d'une offre
    @GetMapping("/{id}")
    public ResponseEntity<?> getOffer(@PathVariable Long id) {
        return ResponseEntity.ok(offerService.getById(id));
    }

    // Publier une offre
    @PostMapping
    public ResponseEntity<?> createOffer(@RequestBody Offer offer) {
        return ResponseEntity.ok(offerService.create(offer));
    }

    // Modifier une offre
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOffer(@PathVariable Long id, @RequestBody Offer offer) {
        return ResponseEntity.ok(offerService.update(id, offer));
    }

    // Supprimer une offre
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOffer(@PathVariable Long id) {
        offerService.delete(id);
        return ResponseEntity.ok("Offer deleted");
    }

    // Recherche / filtrage
    @GetMapping("/search")
    public List<Offer> search(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String domain,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String type
    ) {
        return offerService.search(title,domain, location, type);
    }
}
