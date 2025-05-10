package com.fuelquota.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class VehicleRegistrationDto {

    @NotBlank(message = "Vehicle number is required")
    @Pattern(regexp = "^[A-Z]{2}-\\d{4}$", message = "Vehicle number must be in the format XX-0000")
    private String vehicleNumber;

    @NotBlank(message = "Owner NIC is required")
    private String ownerNic;

    @NotBlank(message = "Vehicle type is required")
    private String vehicleType;

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Model is required")
    private String model;

    @NotBlank(message = "Color is required")
    private String color;

    @NotBlank(message = "Year of manufacture is required")
    @Pattern(regexp = "^\\d{4}$", message = "Year of manufacture must be a valid year")
    private String yearOfManufacture;
}