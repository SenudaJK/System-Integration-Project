package com.fuelquota.management.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String vehicleNumber;

    @Column(nullable = false, unique = true)
    private String chassisNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleType vehicleType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FuelType fuelType;

    @Column(nullable = false)
    private boolean verified = false;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
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