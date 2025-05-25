package com.fuelquota.management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleInfoDTO {
    private Long id;
    private String vehicleNumber;
    private String chassisNumber;
    private String fuelType;
    private Double weeklyAvailableQuantity;
    private Double weeklyQuota;
    private String vehicleTypeName;
    private OwnerDTO owner;
}
