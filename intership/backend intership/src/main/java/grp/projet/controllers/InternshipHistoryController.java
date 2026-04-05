package grp.projet.controllers;

import grp.projet.DTOs.InternshipHistoryRequest;
import grp.projet.DTOs.InternshipHistoryResponse;
import grp.projet.services.InternshipHistoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/internships")
public class InternshipHistoryController {

    private final InternshipHistoryService internship_history_service;

    public InternshipHistoryController(
            InternshipHistoryService internship_history_service
    ) {
        this.internship_history_service = internship_history_service;
    }

    @GetMapping
    public List<InternshipHistoryResponse> get_my_internships() {
        return internship_history_service.get_my_internships();
    }

    @PostMapping
    public InternshipHistoryResponse add_internship(
            @RequestBody InternshipHistoryRequest request
    ) {
        return internship_history_service.add_internship(request);
    }

    @DeleteMapping("/{internship_id}")
    public void delete_internship(@PathVariable Long internship_id) {
        internship_history_service.delete_internship(internship_id);
    }
}