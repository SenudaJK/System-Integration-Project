package com.mottorVehicalDepartment.mockDB.controller;

import com.mottorVehicalDepartment.mockDB.model.VehicleOwner;
import com.mottorVehicalDepartment.mockDB.service.OwnerService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/owners")
public class OwnerController {

    private final OwnerService ownerService;

    public OwnerController(OwnerService ownerService) {
        this.ownerService = ownerService;
    }

    @GetMapping
    public List<VehicleOwner> getAllOwners() {
        return ownerService.getAllOwners();
    }
}