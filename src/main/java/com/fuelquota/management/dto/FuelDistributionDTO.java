package com.fuelquota.management.dto;

import com.fuelquota.management.model.FuelDistribution.FuelType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class FuelDistributionDTO {
    @NotNull(message = "Fuel station ID is required")
    private Long fuelStationId;
    
    @NotNull(message = "Fuel amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Fuel amount must be positive")
    @Positive(message = "Fuel amount must be positive")
    private Double fuelAmount;
    
    @NotNull(message = "Fuel type is required")
    private FuelType fuelType;
    
    private String notes;
}