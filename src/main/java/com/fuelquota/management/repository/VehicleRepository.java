package com.fuelquota.management.repository;

import com.fuelquota.management.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);
    Optional<Vehicle> findByChassisNumber(String chassisNumber);
    boolean existsByVehicleNumber(String vehicleNumber);
    boolean existsByChassisNumber(String chassisNumber);
    List<Vehicle> findByOwnerNic(String ownerNic);
    List<Vehicle> findByOwnerId(Long ownerId);
    Optional<Vehicle> findByQrCode(String qrCode);
}