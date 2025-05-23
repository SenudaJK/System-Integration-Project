package com.fuelquota.management.controller;

import com.fuelquota.management.dto.FuelStationDTO;
import com.fuelquota.management.service.FuelStationService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
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

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleEntityNotFoundException(EntityNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
}