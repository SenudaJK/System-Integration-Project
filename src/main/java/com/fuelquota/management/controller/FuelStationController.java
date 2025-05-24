package com.fuelquota.management.controller;

import com.fuelquota.management.dto.FuelStationDTO;
import com.fuelquota.management.service.FuelStationService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fuel-stations")
public class FuelStationController {

    private final FuelStationService fuelStationService;

    @Autowired
    public FuelStationController(FuelStationService fuelStationService) {
        this.fuelStationService = fuelStationService;
    }

    @PostMapping
    public ResponseEntity<FuelStationDTO> registerFuelStation(@Valid @RequestBody FuelStationDTO fuelStationDTO) {
        FuelStationDTO createdFuelStation = fuelStationService.registerFuelStation(fuelStationDTO);
        return new ResponseEntity<>(createdFuelStation, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FuelStationDTO> getFuelStationById(@PathVariable Long id) {
        FuelStationDTO fuelStationDTO = fuelStationService.getFuelStationById(id);
        return ResponseEntity.ok(fuelStationDTO);
    }

    @GetMapping
    public ResponseEntity<List<FuelStationDTO>> getAllFuelStations() {
        List<FuelStationDTO> fuelStations = fuelStationService.getAllFuelStations();
        return ResponseEntity.ok(fuelStations);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FuelStationDTO> updateFuelStation(@PathVariable Long id,
                                                            @Valid @RequestBody FuelStationDTO fuelStationDTO) {
        FuelStationDTO updatedFuelStation = fuelStationService.updateFuelStation(id, fuelStationDTO);
        return ResponseEntity.ok(updatedFuelStation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFuelStation(@PathVariable Long id) {
        fuelStationService.deleteFuelStation(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<FuelStationDTO> approveFuelStation(@PathVariable Long id) {
        FuelStationDTO approvedFuelStation = fuelStationService.approveFuelStation(id);
        return ResponseEntity.ok(approvedFuelStation);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            if (fuelStationService.login(loginRequest.contactNumber(), loginRequest.password())) {
                return ResponseEntity.ok("Login successful");
            } else {
                return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Login failed: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleEntityNotFoundException(EntityNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
}

record LoginRequest(
        @NotBlank(message = "Contact number is required")
        @Pattern(regexp = "^[0-9]{10}$", message = "Contact number must be exactly 10 digits")
        String contactNumber,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        String password
) {}