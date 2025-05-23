package com.fuelquota.management.controller;

import com.fuelquota.management.dto.VehicleRegistrationDto;
import com.fuelquota.management.model.Owner;
import com.fuelquota.management.model.Vehicle;
import com.fuelquota.management.service.VehicleService;
import com.fuelquota.management.service.OwnerService;
import com.fuelquota.management.dto.VehicleValidationResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicle")
@RequiredArgsConstructor
public class VehicleRegistrationController {

    private final VehicleService vehicleService;
    private final OwnerService ownerService;

    @PostMapping("/register")
    public ResponseEntity<?> registerVehicle(@Valid @RequestBody VehicleRegistrationDto vehicleDto) {
        try {
            Vehicle vehicle = vehicleService.registerVehicle(vehicleDto);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Vehicle registered successfully");
            response.put("vehicleId", vehicle.getId());
            response.put("vehicleNumber", vehicle.getVehicleNumber());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "An unexpected error occurred");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/vehicles/{ownerNic}")
    public ResponseEntity<?> getVehiclesByOwner(@PathVariable String ownerNic) {
        try {
            List<Vehicle> vehicles = vehicleService.findVehiclesByOwnerNic(ownerNic);
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/validate-vehicle-by-chassis") /**/
    public ResponseEntity<?> validateVehicleByChassis(@RequestParam String chassisNumber,
            @RequestParam String vehicleNumber, @RequestParam String nic, @RequestParam String fuelType,
            @RequestParam String vehicleType) {
        try {
            // Step 1: Fetch vehicle details from the external API
            String thirdPartyApiUrl = "http://localhost:8081/api/vehicles/by-chassis?chassisNumber=" + chassisNumber;
            VehicleValidationResponse thirdPartyResponse = vehicleService
                    .fetchVehicleDetailsByChassis(thirdPartyApiUrl);

            // Step 2: Validate vehicle details
            boolean isValid = vehicleService.validateVehicleDetailsByChassis(thirdPartyResponse, vehicleNumber, nic,
                    fuelType, vehicleType);

            if (!isValid) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Vehicle details validation failed.");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Step 3: Return success response
            Map<String, String> response = new HashMap<>();
            response.put("message", "Vehicle details validated successfully.");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "An unexpected error occurred.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/vehicle-info-by-owner-email")
    public ResponseEntity<?> getVehicleInfoByOwnerEmail(@RequestParam String email) {
        try {
            // Step 1: Fetch the owner by email
            Owner owner = ownerService.findOwnerByEmail(email);
            if (owner == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Owner not found for the provided email.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }

            // Step 2: Fetch vehicles by owner ID
            List<Vehicle> vehicles = vehicleService.findVehiclesByOwnerId(owner.getId());
            if (vehicles.isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "No vehicles found for the owner.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }

            // Step 3: Prepare the response
            List<Map<String, Object>> vehicleInfoList = new ArrayList<>();
            for (Vehicle vehicle : vehicles) {
                Map<String, Object> vehicleInfo = new HashMap<>();
                vehicleInfo.put("vehicleNumber", vehicle.getVehicleNumber());
                vehicleInfo.put("qrCode", vehicle.getQrCode());
                vehicleInfoList.add(vehicleInfo);
            }

            return ResponseEntity.ok(vehicleInfoList);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "An unexpected error occurred.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

}