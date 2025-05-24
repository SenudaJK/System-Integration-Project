package com.fuelquota.management.dto;

import lombok.Data;

@Data
public class OrderDTO {
    private Long orderId;
    private String orderDate;
    private Double orderAmount;
    private String fuelType;
    private Long fuelStationId;
    // Owner details from FuelStation
    private String ownerName;
    private String stationName;
    private String location;
    private String contactNumber;
}