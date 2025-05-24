package com.fuelquota.management.controller;

import com.fuelquota.management.dto.FuelInventoryDTO;
import com.fuelquota.management.service.FuelInventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fuel-inventory")
public class FuelInventoryController {

    @Autowired
    private FuelInventoryService fuelInventoryService;

    @GetMapping("/{fuelStationId}")
    public ResponseEntity<List<FuelInventoryDTO>> getInventoryByFuelStationId(@PathVariable Long fuelStationId) {
        List<FuelInventoryDTO> inventory = fuelInventoryService.getInventoryByFuelStationId(fuelStationId);
        return ResponseEntity.ok(inventory);
    }

    @PutMapping("/{fuelStationId}/update-amount")
    public ResponseEntity<FuelInventoryDTO> updateFuelAmount(
            @PathVariable Long fuelStationId,
            @RequestBody FuelInventoryDTO fuelInventoryDTO) {
        fuelInventoryDTO.setFuelStationId(fuelStationId);
        FuelInventoryDTO updatedInventory = fuelInventoryService.updateFuelAmount(fuelStationId, fuelInventoryDTO);
        return ResponseEntity.ok(updatedInventory);
    }

    @PutMapping("/{fuelStationId}/update-consumed")
    public ResponseEntity<FuelInventoryDTO> updateFuelConsumed(
            @PathVariable Long fuelStationId,
            @RequestBody FuelInventoryDTO fuelInventoryDTO) {
        fuelInventoryDTO.setFuelStationId(fuelStationId);
        FuelInventoryDTO updatedInventory = fuelInventoryService.updateFuelConsumed(fuelStationId, fuelInventoryDTO);
        return ResponseEntity.ok(updatedInventory);
    }

    @PutMapping("/{fuelStationId}/restock")
    public ResponseEntity<FuelInventoryDTO> restockFuelAmount(
            @PathVariable Long fuelStationId,
            @RequestBody FuelInventoryDTO fuelInventoryDTO) {
        fuelInventoryDTO.setFuelStationId(fuelStationId);
        FuelInventoryDTO updatedInventory = fuelInventoryService.restockFuelAmount(fuelStationId, fuelInventoryDTO);
        return ResponseEntity.ok(updatedInventory);
    }
}