package grp.projet.DTOs;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentProfileResponse {

    private Long id;
    private String first_name;
    private String last_name;
    private String email;
    private String phone;
    private String address;
    private String date_of_birth;
    private String education_level;
    private String major;
    private String university;
    private Integer graduation_year;
    private String cv_path;
    private String profile_picture;
}