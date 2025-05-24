package com.fuelquota.management.controller;

import com.fuelquota.management.dto.PumpFuelRequest;
import com.fuelquota.management.dto.VehicleInfoDTO;
import com.fuelquota.management.service.FuelDispenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vehicles")
@Tag(name = "Fuel Dispense", description = "Endpoints for dispensing fuel and updating quotas")
public class FuelDispenseController {
    private final FuelDispenseService fuelDispenseService;

    public FuelDispenseController(FuelDispenseService fuelDispenseService) {
        this.fuelDispenseService = fuelDispenseService;
    }

    @PutMapping("/dispense")
    @Operation(summary = "Dispense fuel and update weekly available quantity by QR code")
    public ResponseEntity<VehicleInfoDTO> dispenseFuel(@RequestBody @Valid PumpFuelRequest request) {
        VehicleInfoDTO updatedInfo = fuelDispenseService.dispenseFuel(request);
        return ResponseEntity.ok(updatedInfo);
    }
}