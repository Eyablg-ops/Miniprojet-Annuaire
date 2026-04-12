package grp.projet.DTOs;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InternshipHistoryResponse {

    private Long id;
    private String company_name;
    private String position;
    private String description;
    private String start_date;
    private String end_date;
    private String report_path;
}