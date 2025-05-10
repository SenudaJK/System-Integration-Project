package com.fuelquota.management.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import com.azure.security.keyvault.secrets.SecretClient; // Add this import for SecretClient

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Autowired(required = false)
    private SecretClient secretClient;

    @Value("${jwt.secret.name:jwt-secret}")
    private String jwtSecretName;

    @Value("${jwt.secret:DefaultSecretForLocalDevelopment}")
    private String defaultJwtSecret;

    @Value("${jwt.expiration:86400000}") // Default: 24 hours
    private int jwtExpirationMs;

    private String getJwtSecret() {
        if (secretClient != null) {
            try {
                return secretClient.getSecret(jwtSecretName).getValue();
            } catch (Exception e) {
                logger.warn("Failed to retrieve secret from Key Vault. Falling back to default.", e);
            }
        }
        return defaultJwtSecret;
    }

    private Key getSigningKey() {
        byte[] keyBytes = getJwtSecret().getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateJwtToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        
        logger.debug("Generating JWT for user: {}", userPrincipal.getUsername());
        logger.debug("User authorities: {}", userPrincipal.getAuthorities());
        
        Date issuedAt = new Date();
        Date expiration = new Date(issuedAt.getTime() + jwtExpirationMs);
        
        logger.debug("JWT issuedAt: {}", issuedAt);
        logger.debug("JWT expiration: {}", expiration);
        
        // Extract roles for custom claims
        List<String> roles = userPrincipal.getAuthorities().stream()
            .map(authority -> authority.getAuthority())
            .collect(Collectors.toList());
        
        String token = Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .claim("roles", roles)  // Add roles as a claim
                .setIssuedAt(issuedAt)
                .setExpiration(expiration)
                .signWith(getSigningKey())
                .compact();
        
        logger.debug("Generated JWT token: {}", token.substring(0, Math.min(token.length(), 10)) + "...");
        return token;
    }

    public String getUserNameFromJwtToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
                
        logger.debug("JWT claims: {}", claims);
        return claims.getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(authToken);
            logger.debug("JWT validated successfully");
            return true;
        } catch (SignatureException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("JWT validation error: {}", e.getMessage());
        }
        return false;
    }
}