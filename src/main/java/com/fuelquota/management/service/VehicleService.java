package com.fuelquota.management.service;

import com.fuelquota.management.dto.VehicleRegistrationDto;
import com.fuelquota.management.model.Owner;
import com.fuelquota.management.model.Vehicle;
import com.fuelquota.management.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final OwnerService ownerService;
    private final TrafficDepartmentService trafficDepartmentService;

    @Transactional
    public Vehicle registerVehicle(VehicleRegistrationDto vehicleDto) {
        // Check if vehicle already exists
        if (vehicleRepository.existsByVehicleNumber(vehicleDto.getVehicleNumber())) {
            throw new IllegalArgumentException("Vehicle with this number already registered");
        }

        if (vehicleRepository.existsByChassisNumber(vehicleDto.getChassisNumber())) {
            throw new IllegalArgumentException("Vehicle with this chassis number already registered");
        }

        // Get owner
        Owner owner = ownerService.findByNic(vehicleDto.getOwnerNic())
                .orElseThrow(() -> new IllegalArgumentException("Owner not found with NIC: " + vehicleDto.getOwnerNic()));

        // Validate vehicle information with traffic department
        boolean isValid = trafficDepartmentService.validateVehicleInfo(vehicleDto, owner.getNic());
        if (!isValid) {
            throw new IllegalArgumentException("Vehicle information doesn't match with traffic department records");
        }

        Vehicle vehicle = new Vehicle();
        vehicle.setVehicleNumber(vehicleDto.getVehicleNumber());
        vehicle.setChassisNumber(vehicleDto.getChassisNumber());
        vehicle.setVehicleType(vehicleDto.getVehicleType());
        vehicle.setFuelType(vehicleDto.getFuelType());
        vehicle.setOwner(owner);
        vehicle.setVerified(true);

        return vehicleRepository.save(vehicle);
    }

    public Optional<Vehicle> findByVehicleNumber(String vehicleNumber) {
        return vehicleRepository.findByVehicleNumber(vehicleNumber);
    }

    public List<Vehicle> findVehiclesByOwnerNic(String ownerNic) {
        return vehicleRepository.findByOwnerNic(ownerNic);
    }
}