package com.fuelquota.management.controller;

import com.fuelquota.management.dto.LoginDto;
import com.fuelquota.management.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        return authService.login(loginDto);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody OwnerRegistrationDto ownerRegistrationDto) {
        return authService.register(ownerRegistrationDto);
    }
}