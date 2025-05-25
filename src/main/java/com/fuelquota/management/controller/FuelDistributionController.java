package com.fuelquota.management.controller;

import com.fuelquota.management.dto.FuelDistributionDTO;
import com.fuelquota.management.model.FuelDistribution;
import com.fuelquota.management.model.FuelDistribution.DistributionStatus;
import com.fuelquota.management.service.FuelDistributionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fuel-distributions")
@Tag(name = "Fuel Distribution Management", description = "APIs for managing fuel distribution to stations")
public class FuelDistributionController {
    
    private static final Logger logger = LoggerFactory.getLogger(FuelDistributionController.class);
    
    @Autowired
    private FuelDistributionService distributionService;
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new fuel distribution", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<FuelDistribution> createDistribution(@Valid @RequestBody FuelDistributionDTO distributionDTO) {
        logger.info("Request to create new fuel distribution received");
        FuelDistribution created = distributionService.createDistribution(distributionDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STATION_MANAGER')")
    @Operation(summary = "Update distribution status", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<FuelDistribution> updateStatus(
            @PathVariable Long id, 
            @RequestParam DistributionStatus status) {
        logger.info("Request to update distribution status: {} to {}", id, status);
        FuelDistribution updated = distributionService.updateDistributionStatus(id, status);
        return ResponseEntity.ok(updated);
    }
    
    @GetMapping("/station/{stationId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STATION_MANAGER')")
    @Operation(summary = "Get distributions for a station", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Page<FuelDistribution>> getStationDistributions(
            @PathVariable Long stationId,
            @RequestParam(required = false) DistributionStatus status,
            Pageable pageable) {
        logger.info("Fetching distributions for station: {}", stationId);
        Page<FuelDistribution> distributions = distributionService.getDistributionsForStation(stationId, status, pageable);
        return ResponseEntity.ok(distributions);
    }
    
    @GetMapping("/recent")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get recent distributions", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<FuelDistribution>> getRecentDistributions(
            @RequestParam(defaultValue = "10") int limit) {
        logger.info("Fetching {} recent distributions", limit);
        List<FuelDistribution> distributions = distributionService.getRecentDistributions(limit);
        return ResponseEntity.ok(distributions);
    }
    
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get fuel distribution statistics", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Map<String, Double>> getDistributionStats() {
        logger.info("Fetching fuel distribution statistics");
        Map<String, Double> stats = distributionService.getFuelDistributionStatsByType();
        return ResponseEntity.ok(stats);
    }
}