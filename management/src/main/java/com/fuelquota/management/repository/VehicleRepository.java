package com.fuelquota.management.repository;

import com.fuelquota.management.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    // Additional query methods can be defined here if needed
}