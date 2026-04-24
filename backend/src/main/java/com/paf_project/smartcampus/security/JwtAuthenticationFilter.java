package com.paf_project.smartcampus.security;

import com.paf_project.smartcampus.utils.JwtUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                Claims claims = Jwts.parser()
                        .verifyWith(jwtUtils.getSigningKey())
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                String email = claims.getSubject();
                // Extract the role claim we added in JwtUtils
                String role = claims.get("role", String.class);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    
                    // Create authority from the role string (e.g., "ROLE_ADMIN")
                    List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                            new SimpleGrantedAuthority(role != null ? role : "ROLE_USER")
                    );

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            authorities // Authorities are now passed correctly
                    );
                    
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception e) {
                System.out.println("Invalid JWT: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}