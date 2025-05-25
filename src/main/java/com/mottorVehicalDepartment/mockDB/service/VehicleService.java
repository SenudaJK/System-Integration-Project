package com.mottorVehicalDepartment.mockDB.service;

import com.mottorVehicalDepartment.mockDB.model.Vehicle;
import com.mottorVehicalDepartment.mockDB.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    // public List<Vehicle> getVehiclesByOwnerNic(String nic) {
    //     return vehicleRepository.findByOwnerNic(nic);
    // }

    public Vehicle getVehicleByChassisNumber(String chassisNumber) {
        return vehicleRepository.findByChassisNumber(chassisNumber);
    }
}