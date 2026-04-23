package com.paf_project.smartcampus.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.paf_project.smartcampus.model.User;
import com.paf_project.smartcampus.service.UserService;
import com.paf_project.smartcampus.utils.JwtUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserService userService; // Inject your service here

    @Override
    public void onAuthenticationSuccess(
        HttpServletRequest request,
        HttpServletResponse response,
        Authentication authentication
    ) throws IOException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        // 1. THIS IS THE KEY: Ensure user is created/fetched first
        User user = userService.processOAuthPostLogin(email, name);

        // 2. Now you safely have the role
        String role = user.getRole();
        String token = jwtUtils.generateToken(email);

        // 3. Redirect with the confirmed role
        String targetUrl = String.format(
            "http://localhost:3000/login-success?token=%s&role=%s", 
            token, 
            role
        );
        
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}