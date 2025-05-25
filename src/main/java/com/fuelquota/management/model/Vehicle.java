package com.fuelquota.management.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String vehicleNumber;

    @Column(nullable = false, unique = true)
    private String chassisNumber;

    @ManyToOne
    @JoinColumn(name = "vehicle_type_id", nullable = false)
    private VehicleTypeEntity vehicleType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FuelType fuelType;

    @Column(nullable = false)
    private boolean verified = false;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private Owner owner;

    @Column(columnDefinition = "TEXT") // Add the qr_code column
    private String qrCode;

    @Column(name = "weekly_available_quantity", nullable = false)
    private Double weeklyAvailableQuantity = 0.0;

    // Keep the enum for backwards compatibility with existing code that might use it
    public enum VehicleTypeEnum {
        MOTORCYCLE, THREE_WHEELER, CAR, VAN, BUS, LORRY, TRUCK, HEAVY_VEHICLE
    }    public enum FuelType {
        DIESEL, ELECTRIC, KEROSENE, PETROL
    }

    // Helper method to get weekly quota from vehicle type
    public Double getWeeklyQuota() {
        return vehicleType != null ? vehicleType.getWeeklyQuota() : 0.0;
    }

    // Helper method to reset weekly available quantity (can be called weekly)
    public void resetWeeklyQuantity() {
        this.weeklyAvailableQuantity = getWeeklyQuota();
    }

    // Helper method to check if fuel can be dispensed
    public boolean canDispenseFuel(Double requestedAmount) {
        return weeklyAvailableQuantity >= requestedAmount;
    }

    // Helper method to dispense fuel (reduces available quantity)
    public boolean dispenseFuel(Double amount) {
        if (canDispenseFuel(amount)) {
            weeklyAvailableQuantity -= amount;
            return true;
        }
        return false;
    }
}