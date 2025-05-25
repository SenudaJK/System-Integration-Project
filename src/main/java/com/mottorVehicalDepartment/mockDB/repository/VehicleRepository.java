package com.mottorVehicalDepartment.mockDB.repository;

import com.mottorVehicalDepartment.mockDB.model.Vehicle;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

// public interface VehicleRepository extends JpaRepository<Vehicle, String> {
//     @Query("SELECT v FROM Vehicle v WHERE v.owner.nic = :nic")
//     List<Vehicle> findByOwnerNic(@Param("nic") String nic);
// }

public interface VehicleRepository extends JpaRepository<Vehicle, String> {
    Vehicle findByChassisNumber(String chassisNumber);
}