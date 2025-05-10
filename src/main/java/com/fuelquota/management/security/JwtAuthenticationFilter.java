package com.fuelquota.management.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Enumeration;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = parseJwt(request);
            logger.debug("Processing request to '{}' with JWT: {}", request.getRequestURI(), jwt != null ? "present" : "absent");
            
            // For debugging: log all headers
            logger.debug("Request headers:");
            Enumeration<String> headerNames = request.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                logger.debug("{}: {}", headerName, request.getHeader(headerName));
            }
            
            if (jwt != null) {
                try {
                    if (jwtUtils.validateJwtToken(jwt)) {
                        String username = jwtUtils.getUserNameFromJwtToken(jwt);
                        logger.debug("JWT validated successfully for user: {}", username);

                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                        logger.debug("User authorities: {}", userDetails.getAuthorities());
                        
                        UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        logger.debug("Authentication set in SecurityContextHolder for user: {}", username);
                    } else {
                        logger.warn("JWT validation failed for token");
                    }
                } catch (Exception e) {
                    logger.error("JWT validation error: {}", e.getMessage(), e);
                }
            } else {
                logger.debug("No JWT token found in request");
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        logger.debug("Authorization header: {}", headerAuth);

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            String token = headerAuth.substring(7);
            logger.debug("JWT token extracted: {}", token.substring(0, Math.min(token.length(), 10)) + "...");
            return token;
        }

        return null;
    }
}