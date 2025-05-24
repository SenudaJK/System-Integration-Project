package com.fuelquota.management.controller;

import com.fuelquota.management.model.VehicleTypeEntity;
import com.fuelquota.management.service.VehicleTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/vehicle-types")
@RequiredArgsConstructor
public class VehicleTypeController {

    private final VehicleTypeService vehicleTypeService;

    @GetMapping
    public ResponseEntity<List<VehicleTypeEntity>> getAllVehicleTypes() {
        List<VehicleTypeEntity> vehicleTypes = vehicleTypeService.getAllVehicleTypes();
        return ResponseEntity.ok(vehicleTypes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleTypeEntity> getVehicleTypeById(@PathVariable Long id) {
        return vehicleTypeService.getVehicleTypeById(id)
                .map(vehicleType -> ResponseEntity.ok(vehicleType))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<VehicleTypeEntity> getVehicleTypeByName(@PathVariable String name) {
        return vehicleTypeService.getVehicleTypeByName(name)
                .map(vehicleType -> ResponseEntity.ok(vehicleType))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/fuel-type/{fuelType}")
    public ResponseEntity<List<VehicleTypeEntity>> getVehicleTypesByFuelType(@PathVariable VehicleTypeEntity.FuelType fuelType) {
        List<VehicleTypeEntity> vehicleTypes = vehicleTypeService.getVehicleTypesByFuelType(fuelType);
        return ResponseEntity.ok(vehicleTypes);
    }

    @PostMapping
    public ResponseEntity<VehicleTypeEntity> createVehicleType(@Valid @RequestBody VehicleTypeEntity vehicleType) {
        try {
            VehicleTypeEntity createdVehicleType = vehicleTypeService.createVehicleType(vehicleType);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdVehicleType);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleTypeEntity> updateVehicleType(@PathVariable Long id, @Valid @RequestBody VehicleTypeEntity vehicleType) {
        try {
            VehicleTypeEntity updatedVehicleType = vehicleTypeService.updateVehicleType(id, vehicleType);
            return ResponseEntity.ok(updatedVehicleType);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicleType(@PathVariable Long id) {
        try {
            vehicleTypeService.deleteVehicleType(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/quota")
    public ResponseEntity<VehicleTypeEntity> updateWeeklyQuota(@PathVariable Long id, @RequestBody Double newQuota) {
        try {
            VehicleTypeEntity updatedVehicleType = vehicleTypeService.updateWeeklyQuota(id, newQuota);
            return ResponseEntity.ok(updatedVehicleType);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
