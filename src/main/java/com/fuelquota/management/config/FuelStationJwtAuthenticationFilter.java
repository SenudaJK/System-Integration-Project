package com.fuelquota.management.config;

import com.fuelquota.management.model.FuelStation;
import com.fuelquota.management.repository.FuelStationRepository;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
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
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class FuelStationJwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(FuelStationJwtAuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private FuelStationRepository fuelStationRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        logger.debug("Processing request to '{}' with JWT: {}", request.getRequestURI(), request.getHeader("Authorization") != null ? "present" : "absent");

        String jwtToken = null;
        String contactNumber = null;
        final String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwtToken = authorizationHeader.substring(7);
            try {
                contactNumber = jwtUtil.extractUsername(jwtToken);
                logger.debug("Extracted contact number from JWT: {}", contactNumber);
            } catch (IllegalArgumentException e) {
                logger.error("Unable to get JWT Token", e);
            } catch (ExpiredJwtException e) {
                logger.warn("JWT Token has expired", e);
            } catch (MalformedJwtException | UnsupportedJwtException | SignatureException e) {
                logger.error("Invalid JWT Token", e);
            }
        } else {
            logger.debug("No JWT token found in request");
        }

        if (contactNumber != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                if (jwtUtil.validateToken(jwtToken, contactNumber)) {
                    String finalContactNumber = contactNumber;
                    FuelStation fuelStation = fuelStationRepository.findByContactNumber(contactNumber)
                            .orElseThrow(() -> {
                                logger.warn("Fuel station not found with contact number: {}", finalContactNumber);
                                return new IllegalArgumentException("Fuel station not found: " + finalContactNumber);
                            });
                    UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                            fuelStation.getContactNumber(),
                            fuelStation.getPassword(),
                            fuelStation.isActive(),
                            true, true, true,
                            Collections.singletonList(() -> "ROLE_OWNER")
                    );
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.debug("JWT authentication successful for contact number: {}", contactNumber);
                } else {
                    logger.warn("JWT validation failed for contact number: {}", contactNumber);
                }
            } catch (Exception e) {
                logger.error("Authentication failed for contact number: {}", contactNumber, e);
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();

        if ("POST".equalsIgnoreCase(method) && ("/api/fuel-stations".equals(path) || "/api/fuel-stations/login".equals(path))) {
            logger.debug("Skipping JWT filter for public endpoint: {} {}", method, path);
            return true;
        }

        return false;
    }
}