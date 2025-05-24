package com.fuelquota.management.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PumpFuelRequest {
    @NotBlank
    private String qrCode;

    @NotNull
    @Min(value = 1, message = "Pumped amount must be at least 1 liter")
    private Double amount;
}