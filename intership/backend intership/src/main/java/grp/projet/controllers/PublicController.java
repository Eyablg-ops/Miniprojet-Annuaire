package grp.projet.controllers;

import grp.projet.entities.Company;
import grp.projet.repositories.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class PublicController {

    @Autowired
    private CompanyRepository companyRepository;

    @GetMapping("/companies")
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }
}