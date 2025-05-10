package com.fuelquota.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@Data
public class QuotaDto {

    @NotBlank(message = "Quota ID is required")
    private String quotaId;

    @NotBlank(message = "Owner ID is required")
    private String ownerId;

    @Positive(message = "Fuel amount must be positive")
    private double fuelAmount;

    @NotBlank(message = "Quota period is required")
    private String period;

    @NotBlank(message = "Status is required")
    private String status;
}