package com.fuelquota.management.controller;

import com.fuelquota.management.dto.OwnerRegistrationDto;
import com.fuelquota.management.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/owners")
public class OwnerController {

    private final OwnerService ownerService;

    @Autowired
    public OwnerController(OwnerService ownerService) {
        this.ownerService = ownerService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerOwner(@RequestBody OwnerRegistrationDto ownerRegistrationDto) {
        return ResponseEntity.ok(ownerService.registerOwner(ownerRegistrationDto));
    }

    // Additional endpoints can be added here for other owner-related operations
}