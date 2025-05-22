package com.fuelquota.management.controller;

import com.fuelquota.management.dto.VehicleTypeDTO;
import com.fuelquota.management.service.VehicleTypeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/vehicle-types")
public class VehicleTypeController {
    
    private static final Logger logger = LoggerFactory.getLogger(VehicleTypeController.class);
    
    @Autowired
    private VehicleTypeService vehicleTypeService;
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleTypeDTO> createVehicleType(@Valid @RequestBody VehicleTypeDTO vehicleTypeDTO) {
        logger.info("REST request to create vehicle type: {}", vehicleTypeDTO.getName());
        VehicleTypeDTO result = vehicleTypeService.createVehicleType(vehicleTypeDTO);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<VehicleTypeDTO>> getAllVehicleTypes() {
        logger.info("REST request to get all vehicle types");
        List<VehicleTypeDTO> result = vehicleTypeService.getAllVehicleTypes();
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<VehicleTypeDTO> getVehicleType(@PathVariable Long id) {
        logger.info("REST request to get vehicle type with ID: {}", id);
        VehicleTypeDTO result = vehicleTypeService.getVehicleTypeById(id);
        return ResponseEntity.ok(result);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleTypeDTO> updateVehicleType(
            @PathVariable Long id, 
            @Valid @RequestBody VehicleTypeDTO vehicleTypeDTO) {
        logger.info("REST request to update vehicle type with ID: {}", id);
        VehicleTypeDTO result = vehicleTypeService.updateVehicleType(id, vehicleTypeDTO);
        return ResponseEntity.ok(result);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteVehicleType(@PathVariable Long id) {
        logger.info("REST request to delete vehicle type with ID: {}", id);
        vehicleTypeService.deleteVehicleType(id);
        return ResponseEntity.noContent().build();
    }
}
