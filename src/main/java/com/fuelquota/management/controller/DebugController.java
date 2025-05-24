package com.fuelquota.management.controller;

import com.fuelquota.management.model.Vehicle;
import com.fuelquota.management.model.VehicleTypeEntity;
import com.fuelquota.management.service.VehicleTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
@RequiredArgsConstructor
public class DebugController {

    private final VehicleTypeService vehicleTypeService;

    @GetMapping("/vehicle-types")
    public ResponseEntity<List<VehicleTypeEntity>> getAllVehicleTypes() {
        List<VehicleTypeEntity> vehicleTypes = vehicleTypeService.getAllVehicleTypes();
        return ResponseEntity.ok(vehicleTypes);
    }

    @GetMapping("/vehicle-type-enums")
    public ResponseEntity<Map<String, Object>> getVehicleTypeEnums() {
        Map<String, Object> response = new HashMap<>();
        
        // Get all available enum values
        Vehicle.VehicleTypeEnum[] enums = Vehicle.VehicleTypeEnum.values();
        response.put("availableEnums", enums);
        
        // Get all vehicle types from database
        List<VehicleTypeEntity> entities = vehicleTypeService.getAllVehicleTypes();
        response.put("availableEntities", entities);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/fuel-types")
    public ResponseEntity<Vehicle.FuelType[]> getFuelTypes() {
        return ResponseEntity.ok(Vehicle.FuelType.values());
    }
}
