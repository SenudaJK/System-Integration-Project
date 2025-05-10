package com.fuelquota.management.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String vehicleNumber;
    private String chassisNumber;
    
    @Enumerated(EnumType.STRING)
    private VehicleType vehicleType;
    
    @Enumerated(EnumType.STRING)
    private FuelType fuelType;
    
    private boolean verified;
    
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private Owner owner;
    
    public enum VehicleType {
        MOTORCYCLE, 
        THREE_WHEELER, 
        CAR, 
        VAN, 
        BUS, 
        LORRY, 
        TRUCK, 
        HEAVY_VEHICLE
    }
    
    public enum FuelType {
        PETROL_92, 
        PETROL_95, 
        DIESEL, 
        SUPER_DIESEL, 
        KEROSENE
    }
}