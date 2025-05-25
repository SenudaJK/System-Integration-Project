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

    // Accept vehicle type as string (like "CAR", "MOTORCYCLE", etc.)
    private String vehicleType;

    // New field for entity-based approach
    private Long vehicleTypeId;

    // Keep for backwards compatibility
    private Vehicle.VehicleTypeEnum vehicleTypeEnum;

    @NotNull(message = "Fuel type is required")
    private Vehicle.FuelType fuelType;

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
    public String getVehicleTypeName() {
        if (vehicleType != null && !vehicleType.trim().isEmpty()) {
            return vehicleType.trim().toUpperCase();
        } else if (vehicleTypeId != null) {
            return null; // Will be resolved from database
        } else if (vehicleTypeEnum != null) {
            return vehicleTypeEnum.name();
        }
        return null;
    }
}