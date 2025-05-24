package com.fuelquota.management.controller;

import com.fuelquota.management.dto.OwnerRegistrationDto;
import com.fuelquota.management.dto.VehicleRegistrationDto;
import com.fuelquota.management.model.Owner;
import com.fuelquota.management.model.Vehicle;
import com.fuelquota.management.service.OwnerService;
import com.fuelquota.management.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final OwnerService ownerService;
    private final VehicleService vehicleService;

    @PostMapping("/store-ownervehicle-debug")
    public ResponseEntity<?> storeOwnerDebug(@RequestBody OwnerRegistrationDto ownerDto) {
        try {
            System.out.println("=== TEST ENDPOINT DEBUG ===");
            System.out.println("Received OwnerDto: " + ownerDto);
            System.out.println("Vehicle from OwnerDto: " + ownerDto.getVehicle());
            
            if (ownerDto.getVehicle() != null) {
                VehicleRegistrationDto vehicleDto = ownerDto.getVehicle();
                System.out.println("Vehicle Type String: '" + vehicleDto.getVehicleType() + "'");
                System.out.println("Vehicle Type ID: " + vehicleDto.getVehicleTypeId());
                System.out.println("Vehicle Type Enum: " + vehicleDto.getVehicleTypeEnum());
                System.out.println("Fuel Type: " + vehicleDto.getFuelType());
                System.out.println("Is Valid: " + vehicleDto.isVehicleTypeValid());
            }

            // Save owner information in the database
            Owner owner = ownerService.storeOwner(ownerDto);

            // Extract vehicle details from the nested vehicle object in ownerDto
            VehicleRegistrationDto vehicleDto = ownerDto.getVehicle();

            // Set the owner NIC in the vehicle DTO
            vehicleDto.setOwnerNic(owner.getNic());
         
            // Save vehicle information in the database
            Vehicle vehicle = vehicleService.registerVehicle(vehicleDto);

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Owner and vehicle information stored successfully.");
            response.put("ownerId", owner.getId());
            response.put("vehicleId", vehicle.getId());
            response.put("weeklyAvailableQuantity", vehicle.getWeeklyAvailableQuantity());
            response.put("weeklyQuota", vehicle.getWeeklyQuota());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "An unexpected error occurred: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
