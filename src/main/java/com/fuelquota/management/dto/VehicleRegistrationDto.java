package com.fuelquota.management.dto;

import com.fuelquota.management.model.Vehicle;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VehicleRegistrationDto {

    @NotBlank(message = "Vehicle number is required")
    private String vehicleNumber;

    @NotBlank(message = "Chassis number is required")
    private String chassisNumber;

    @NotNull(message = "Vehicle type is required")
    private Vehicle.VehicleType vehicleType;

    @NotNull(message = "Fuel type is required")
    private Vehicle.FuelType fuelType;

    @NotBlank(message = "Owner NIC is required")
    private String ownerNic;

    private String qrCode; // Add the qrCode field
}