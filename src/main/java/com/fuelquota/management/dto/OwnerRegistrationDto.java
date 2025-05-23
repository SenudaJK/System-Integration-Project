package com.fuelquota.management.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class OwnerRegistrationDto {

    @NotBlank(message = "NIC is required")
   // @Pattern(regexp = "^\\d{9}[vVxX]$|^\\d{12}$", message = "NIC must be a valid Sri Lankan NIC number")
    private String nic;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Address is required")
    private String address;

    

    @Valid
    private VehicleRegistrationDto vehicle; // Nested DTO for vehicle details
}