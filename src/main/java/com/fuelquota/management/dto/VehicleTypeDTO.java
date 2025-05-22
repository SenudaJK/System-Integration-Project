package com.fuelquota.management.dto;

import com.fuelquota.management.model.VehicleType.FuelType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VehicleTypeDTO {
    private Long id;
    
    @NotBlank(message = "Vehicle type name is required")
    private String name;
    
    private String description;
    
    @Positive(message = "Weekly quota must be greater than zero")
    private Double weeklyQuota;
    
    private FuelType fuelType;
}
