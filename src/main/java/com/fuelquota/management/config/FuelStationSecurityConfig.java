package com.fuelquota.management.config;

import com.fuelquota.management.security.AuthEntryPointJwt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class FuelStationSecurityConfig {
    private static final Logger logger = LoggerFactory.getLogger(FuelStationSecurityConfig.class);

    @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:3000}")
    private String[] allowedOrigins;

    @Autowired
    private FuelStationJwtAuthenticationFilter fuelStationJwtAuthenticationFilter;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public SecurityFilterChain fuelStationSecurityFilterChain(HttpSecurity http) throws Exception {
        logger.info("Configuring FuelStation security filter chain");

        http
                .securityMatcher("/api/fuel-stations/**")
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .exceptionHandling(exceptionHandling -> exceptionHandling.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth ->
                        auth
                                .requestMatchers(HttpMethod.POST, "/api/fuel-stations").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/fuel-stations/login").permitAll()
                                .anyRequest().authenticated()
                );

        http.addFilterBefore(fuelStationJwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        logger.info("FuelStation security filter chain configured successfully");
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}