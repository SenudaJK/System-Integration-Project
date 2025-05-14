package com.fuelquota.management.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class FuelDistribution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "station_id", nullable = false)
    @NotNull(message = "Fuel station is required")
    private FuelStation fuelStation;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Fuel amount must be positive")
    @Positive(message = "Fuel amount must be positive")
    private Double fuelAmount;
    
    @Enumerated(EnumType.STRING)
    private FuelType fuelType;
    
    @PastOrPresent(message = "Distribution date cannot be in the future")
    private LocalDateTime distributionDate;
    
    @Enumerated(EnumType.STRING)
    private DistributionStatus status;
    
    private String distributionReference;
    
    @PastOrPresent
    private LocalDateTime completedDate;
    
    @PrePersist
    public void prePersist() {
        if (distributionDate == null) {
            distributionDate = LocalDateTime.now();
        }
        if (distributionReference == null) {
            distributionReference = generateReference();
        }
        if (status == null) {
            status = DistributionStatus.PENDING;
        }
    }
    
    private String generateReference() {
        // Generate a unique reference like: DIST-YYYYMMDD-XXXX
        return "DIST-" + LocalDateTime.now().toString()
            .replaceAll("[^0-9]", "").substring(0, 8) + "-" 
            + String.format("%04d", (int)(Math.random() * 10000));
    }
    
    public enum FuelType {
        PETROL,
        DIESEL,
        KEROSENE
    }
    
    public enum DistributionStatus {
        PENDING,
        IN_TRANSIT,
        DELIVERED,
        CANCELLED
    }
}