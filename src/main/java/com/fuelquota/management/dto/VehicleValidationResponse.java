package com.fuelquota.management.dto;

import lombok.Data;

@Data
public class VehicleValidationResponse {
    private String vehicleId;
    private OwnerDetails owner;
    private String vehicleNo;
    private String vehicleType;
    private String manufacturer;
    private String model;
    private int year;
    private String engineNumber;
    private String chassisNumber;
    private String fuelType;

    @Data
    public static class OwnerDetails {
        private String ownerId;
        private String nic;
        private String firstName;
        private String lastName;
        private String phone;
        private String address;
    }
}