package grp.projet.controllers;

import grp.projet.DTOs.SkillRequest;
import grp.projet.DTOs.SkillResponse;
import grp.projet.services.SkillService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/skills")
public class SkillController {

    private final SkillService skill_service;

    public SkillController(SkillService skill_service) {
        this.skill_service = skill_service;
    }

    @GetMapping
    public List<SkillResponse> get_my_skills() {
        return skill_service.get_my_skills();
    }

    @PostMapping
    public SkillResponse add_skill(@RequestBody SkillRequest request) {
        return skill_service.add_skill(request);
    }

    @DeleteMapping("/{skill_id}")
    public void delete_skill(@PathVariable Long skill_id) {
        skill_service.delete_skill(skill_id);
    }
}