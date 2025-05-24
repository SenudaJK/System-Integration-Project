package com.fuelquota.management.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "orders") // Explicitly set table name to avoid reserved keyword
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @Column(nullable = false)
    private LocalDate orderDate;

    @Column(nullable = false)
    private Double orderAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FuelType fuelType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fuel_station_id", nullable = false)
    private FuelStation fuelStation;
}