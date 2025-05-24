package com.fuelquota.management.repository;

import com.fuelquota.management.model.FuelInventory;
import com.fuelquota.management.model.FuelStation;
import com.fuelquota.management.model.FuelType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FuelInventoryRepository extends JpaRepository<FuelInventory, Long> {
    Optional<FuelInventory> findByFuelStationAndFuelType(FuelStation fuelStation, FuelType fuelType);
    List<FuelInventory> findByFuelStation(FuelStation fuelStation);
}