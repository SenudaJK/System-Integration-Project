package com.fuelquota.management.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Vehicle registration number is required")
    @Pattern(regexp = "^[A-Z0-9]{2,10}$", message = "Vehicle registration number must be between 2-10 uppercase letters and numbers")
    private String vehicleRegistrationNumber;

    
    private String fuelStationName;
    private double fuelAmount;
    private LocalDateTime timestamp;

    @PrePersist
    public void prePersist() {
        timestamp = LocalDateTime.now();
    }
}