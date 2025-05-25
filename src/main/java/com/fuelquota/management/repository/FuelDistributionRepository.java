package com.fuelquota.management.repository;

import com.fuelquota.management.model.FuelDistribution;
import com.fuelquota.management.model.FuelDistribution.DistributionStatus;
import com.fuelquota.management.model.FuelDistribution.FuelType;
import com.fuelquota.management.model.FuelStation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface FuelDistributionRepository extends JpaRepository<FuelDistribution, Long> {
    
    List<FuelDistribution> findByFuelStation(FuelStation station);
    
    List<FuelDistribution> findByStatus(DistributionStatus status);
    
    List<FuelDistribution> findByFuelType(FuelType fuelType);
    
    Page<FuelDistribution> findByFuelStationAndStatusOrderByDistributionDateDesc(
        FuelStation station, DistributionStatus status, Pageable pageable);
    
    @Query("SELECT fd FROM FuelDistribution fd WHERE fd.distributionDate BETWEEN :startDate AND :endDate")
    List<FuelDistribution> findDistributionsInDateRange(
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(fd.fuelAmount) FROM FuelDistribution fd " +
           "WHERE fd.fuelStation = :station AND fd.fuelType = :fuelType AND fd.status = 'DELIVERED'")
    Double getTotalFuelDistributedByStationAndType(
        @Param("station") FuelStation station, 
        @Param("fuelType") FuelType fuelType);
}