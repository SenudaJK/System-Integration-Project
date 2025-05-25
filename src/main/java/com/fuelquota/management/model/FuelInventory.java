package com.fuelquota.management.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "fuel_inventory")
@Data
public class FuelInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fuel_station_id", nullable = false)
    private FuelStation fuelStation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FuelType fuelType;

    @Column(nullable = false)
    private Double amount; // Amount in liters
}