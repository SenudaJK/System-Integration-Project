package com.fuelquota.management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OwnerDTO {
    private Long id;
    private String nic;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
}