package com.mottorVehicalDepartment.mockDB.repository;

import com.mottorVehicalDepartment.mockDB.model.VehicleOwner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleOwnerRepository extends JpaRepository<VehicleOwner, String> {
}