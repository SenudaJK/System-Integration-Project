package com.fuelquota.management.controller;

import com.fuelquota.management.dto.FuelStationDTO;
//import com.fuelquota.management.exception.ResourceNotFoundException;
import com.fuelquota.management.model.FuelStation;
import com.fuelquota.management.model.Transaction;
import com.fuelquota.management.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Get all fuel stations
    @GetMapping("/fuel-stations")
    public ResponseEntity<List<FuelStationDTO>> getAllFuelStations() {
        List<FuelStation> stations = adminService.getAllFuelStations();
        List<FuelStationDTO> stationDTOs = stations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(stationDTOs);
    }

    // Approve a fuel station
    @PutMapping("/fuel-stations/{id}/approve")
    public ResponseEntity<String> approveFuelStation(@PathVariable Long id) {
        adminService.approveFuelStation(id);
        return ResponseEntity.ok("Fuel station approved successfully");
    }

    // Deactivate a fuel station
    @PutMapping("/fuel-stations/{id}/deactivate")
    public ResponseEntity<String> deactivateFuelStation(@PathVariable Long id) {
        adminService.deactivateFuelStation(id);
        return ResponseEntity.ok("Fuel station deactivated successfully");
    }

    // Get all fuel distribution transactions
    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(adminService.getAllTransactions());
    }

    // Helper method to convert FuelStation to DTO
    private FuelStationDTO convertToDTO(FuelStation station) {
        FuelStationDTO dto = new FuelStationDTO();
        dto.setId(station.getId());
        dto.setName(station.getName());
        dto.setLocation(station.getLocation());
        dto.setOwnerName(station.getOwnerName());
        dto.setContactNumber(station.getContactNumber());
        dto.setActive(station.isActive());
        dto.setCreatedAt(station.getCreatedAt());
        return dto;
    }
}