package com.fuelquota.management.repository;

import com.fuelquota.management.model.FuelStation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FuelStationRepository extends JpaRepository<FuelStation, Long> {
    Optional<FuelStation> findByContactNumber(String contactNumber);
}