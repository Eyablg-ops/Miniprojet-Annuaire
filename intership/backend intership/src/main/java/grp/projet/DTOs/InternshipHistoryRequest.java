package grp.projet.DTOs;

import lombok.Data;

@Data
public class InternshipHistoryRequest {

    private String company_name;
    private String position;
    private String description;
    private String start_date;
    private String end_date;
}