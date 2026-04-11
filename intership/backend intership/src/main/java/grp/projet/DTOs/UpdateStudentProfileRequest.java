package grp.projet.DTOs;

import lombok.Data;

@Data
public class UpdateStudentProfileRequest {

    private String first_name;
    private String last_name;
    private String phone;
    private String address;
    private String date_of_birth;
    private String education_level;
    private String major;
    private String university;
    private Integer graduation_year;
    private String profile_picture;
}