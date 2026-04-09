package grp.projet.securite;

public class AuthResponse {
    private String token;
    private String userType;
    private Long userId;
    private String email;
    private String message;

    public AuthResponse(String token, String userType, Long userId, String email) {
        this.token = token;
        this.userType = userType;
        this.userId = userId;
        this.email = email;
        this.message = "Authentication successful";
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
