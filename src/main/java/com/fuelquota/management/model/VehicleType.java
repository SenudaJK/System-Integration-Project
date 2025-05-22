package com.fuelquota.management.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Vehicle type name is required")
    @Column(unique = true)
    private String name;
    
    @Column(length = 500)
    private String description;
    
    @Positive(message = "Weekly quota must be greater than zero")
    private Double weeklyQuota;
    
    @Enumerated(EnumType.STRING)
    private FuelType fuelType;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum FuelType {
        PETROL,
        DIESEL,
        KEROSENE,
        ELECTRIC  // For future use with electric vehicles
    }
}