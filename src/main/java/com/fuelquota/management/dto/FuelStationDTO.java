package com.fuelquota.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for Fuel Station information.
 * Used to transfer fuel station data between application layers.
 */
@Data
public class FuelStationDTO {
    private Long id;

    @NotBlank(message = "Station name is required")
    @Size(max = 100, message = "Station name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "Location is required")
    @Size(max = 200, message = "Location cannot exceed 200 characters")
    private String location;

    @NotBlank(message = "Owner name is required")
    @Size(max = 100, message = "Owner name cannot exceed 100 characters")
    private String ownerName;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Contact number must be exactly 10 digits")
    private String contactNumber;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    private boolean active;
    private LocalDateTime createdAt;

    /**
     * Default constructor
     */
    public FuelStationDTO() {
    }

    /**
     * Full constructor for creating a complete DTO object
     */
    public FuelStationDTO(Long id, String name, String location, String ownerName,
                          String contactNumber, String password, boolean active, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.ownerName = ownerName;
        this.contactNumber = contactNumber;
        this.password = password;
        this.active = active;
        this.createdAt = createdAt;
    }
}