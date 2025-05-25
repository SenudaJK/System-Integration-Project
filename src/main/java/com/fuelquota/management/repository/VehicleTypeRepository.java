package com.fuelquota.management.repository;

import com.fuelquota.management.model.VehicleTypeEntity;
import com.fuelquota.management.model.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleTypeRepository extends JpaRepository<VehicleTypeEntity, Long> {
    
    Optional<VehicleTypeEntity> findByName(String name);
    
    List<VehicleTypeEntity> findByFuelType(VehicleTypeEntity.FuelType fuelType);
    
    boolean existsByName(String name);
}
public interface VehicleTypeRepository extends JpaRepository<VehicleType, Long> {
    Optional<VehicleType> findByName(String name);
    
    List<VehicleType> findByFuelType(VehicleType.FuelType fuelType);
    
    boolean existsByName(String name);
}
