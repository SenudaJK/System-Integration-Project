package com.mottorVehicalDepartment.mockDB.controller;

import com.mottorVehicalDepartment.mockDB.model.Vehicle;
import com.mottorVehicalDepartment.mockDB.service.VehicleService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    // @GetMapping("/api/vehicles/by-nic")
    // public List<Vehicle> getVehiclesByOwnerNic(@RequestParam String nic) {
    //     return vehicleService.getVehiclesByOwnerNic(nic);
    // }

    @GetMapping("/api/vehicles/by-chassis")
    public Vehicle getVehicleByChassisNumber(@RequestParam String chassisNumber) {
        return vehicleService.getVehicleByChassisNumber(chassisNumber);
    }

    
}