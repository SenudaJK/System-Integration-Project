package com.fuelquota.management.dto;

import lombok.Data;

@Data
public class OwnerDto {
    private String id;
    private String nic;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
}