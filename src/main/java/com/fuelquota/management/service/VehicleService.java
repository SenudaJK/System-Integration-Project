package com.fuelquota.management.service;

import com.fuelquota.management.dto.VehicleRegistrationDto;
import com.fuelquota.management.dto.VehicleValidationResponse;
import com.fuelquota.management.model.Owner;
import com.fuelquota.management.model.Vehicle;
import com.fuelquota.management.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final OwnerService ownerService;
    private final TrafficDepartmentService trafficDepartmentService;
    private final RestTemplate restTemplate;

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
                .orElseThrow(
                        () -> new IllegalArgumentException("Owner not found with NIC: " + vehicleDto.getOwnerNic()));

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

    public VehicleValidationResponse fetchVehicleDetailsByChassis(String apiUrl) {
        // Fetch vehicle details from the third-party API
        ResponseEntity<VehicleValidationResponse> response = restTemplate.getForEntity(apiUrl, VehicleValidationResponse.class);

        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            throw new IllegalArgumentException("Failed to fetch vehicle details from external API.");
        }

        return response.getBody();
    }

    public boolean validateVehicleDetailsByChassis(VehicleValidationResponse thirdPartyResponse, String vehicleNumber, String nic, String fuelType, String vehicleType) {
        // Validate vehicle details
        return thirdPartyResponse.getVehicleNo().equals(vehicleNumber) &&
               thirdPartyResponse.getOwner().getNic().equals(nic) &&
               thirdPartyResponse.getFuelType().equalsIgnoreCase(fuelType) &&
               thirdPartyResponse.getVehicleType().equalsIgnoreCase(vehicleType);
    }
}