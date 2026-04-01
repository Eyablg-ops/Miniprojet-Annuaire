package grp.projet.securite;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    public String authenticateAndGenerateToken(String email, String password, String userType) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        final String jwt = jwtUtil.generateToken(userDetails.getUsername(), userType);

        return jwt;
    }
}