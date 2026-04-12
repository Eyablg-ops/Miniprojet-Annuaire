package grp.projet.DTOs;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SkillResponse {

    private Long id;
    private String skill_name;
    private String skill_level;
}