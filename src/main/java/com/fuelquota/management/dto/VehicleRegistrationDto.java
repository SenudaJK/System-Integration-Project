package com.fuelquota.management.dto;

import com.fuelquota.management.model.Vehicle;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VehicleRegistrationDto {

    @NotBlank(message = "Vehicle number is required")
    private String vehicleNumber;

    @NotBlank(message = "Chassis number is required")
    private String chassisNumber;

    // Accept vehicle type as string (like "CAR", "MOTORCYCLE", etc.)
    private String vehicleType;

    // New field for entity-based approach
    private Long vehicleTypeId;    // Keep for backwards compatibility
    private Vehicle.VehicleTypeEnum vehicleTypeEnum;

    @NotBlank(message = "Fuel type is required")
    private String fuelType;  // Accept as string from API

    @NotBlank(message = "Owner NIC is required")
    private String ownerNic;

    private String qrCode; // Add the qrCode field    // Custom validation method to ensure at least one vehicle type is provided
    public boolean isVehicleTypeValid() {
        System.out.println("=== DTO Validation Debug ===");
        System.out.println("vehicleTypeId: " + vehicleTypeId);
        System.out.println("vehicleTypeEnum: " + vehicleTypeEnum);
        System.out.println("vehicleType: '" + vehicleType + "'");
        System.out.println("vehicleType != null: " + (vehicleType != null));
        if (vehicleType != null) {
            System.out.println("vehicleType.trim(): '" + vehicleType.trim() + "'");
            System.out.println("!vehicleType.trim().isEmpty(): " + (!vehicleType.trim().isEmpty()));
        }
        
        boolean result = vehicleTypeId != null || vehicleTypeEnum != null || 
                        (vehicleType != null && !vehicleType.trim().isEmpty());
        System.out.println("Validation result: " + result);
        System.out.println("=== End Debug ===");
        return result;
    }

    // Helper method to get vehicle type name for validation and processing
    public String getVehicleTypeName() {        if (vehicleType != null && !vehicleType.trim().isEmpty()) {
            return vehicleType.trim().toUpperCase();
        } else if (vehicleTypeId != null) {
            return null; // Will be resolved from database
        } else if (vehicleTypeEnum != null) {
            return vehicleTypeEnum.name();
        }
        return null;
    }    // Helper method to get fuel type enum
    public Vehicle.FuelType getFuelTypeEnum() {
        if (fuelType != null && !fuelType.trim().isEmpty()) {
            String upperCaseFuelType = fuelType.trim().toUpperCase();
            
            // Handle mapping from user input to database enum values
            switch (upperCaseFuelType) {
                case "DIESEL":
                    return Vehicle.FuelType.DIESEL;
                case "KEROSENE": 
                    return Vehicle.FuelType.KEROSENE;
                case "PETROL":
                case "PETROL_92":
                    return Vehicle.FuelType.PETROL_92; // Default petrol to PETROL_92
                case "PETROL_95":
                    return Vehicle.FuelType.PETROL_95;
                case "SUPER_DIESEL":
                    return Vehicle.FuelType.SUPER_DIESEL;
                case "ELECTRIC":
                    // Electric not supported in database, throw exception or default
                    throw new IllegalArgumentException("ELECTRIC fuel type not supported in current database schema");
                default:
                    throw new IllegalArgumentException("Unknown fuel type: " + fuelType + ". Supported: DIESEL, KEROSENE, PETROL_92, PETROL_95, SUPER_DIESEL");
            }
        }
        return null;
    }
}