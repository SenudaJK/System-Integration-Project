package com.fuelquota.management.dto;

import lombok.Data;

@Data
public class FuelInventoryDTO {
    private Long id;
    private Long fuelStationId;
    private String fuelType;
    private Double amount;
    private String orderDate; // Added for restocking records
}