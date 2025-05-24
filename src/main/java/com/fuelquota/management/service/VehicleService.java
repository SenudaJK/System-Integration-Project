package com.fuelquota.management.service;

import com.fuelquota.management.dto.VehicleRegistrationDto;
import com.fuelquota.management.dto.VehicleValidationResponse;
import com.fuelquota.management.model.Owner;
import com.fuelquota.management.model.Vehicle;
import com.fuelquota.management.model.VehicleTypeEntity;
import com.fuelquota.management.repository.VehicleRepository;
import com.fuelquota.management.repository.VehicleTypeRepository;
import com.fuelquota.management.util.QRCodeGenerator;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleTypeRepository vehicleTypeRepository;
    private final OwnerService ownerService;
    private final RestTemplate restTemplate;    @Transactional
    public Vehicle registerVehicle(VehicleRegistrationDto vehicleDto) {
        // Check if vehicle already exists
        if (vehicleRepository.existsByVehicleNumber(vehicleDto.getVehicleNumber())) {
            throw new IllegalArgumentException("Vehicle with this number already registered");
        }

        if (vehicleRepository.existsByChassisNumber(vehicleDto.getChassisNumber())) {
            throw new IllegalArgumentException("Vehicle with this chassis number already registered");
        }        // Debug logging to understand what's being received
        System.out.println("DEBUG - Vehicle Registration Data:");
        System.out.println("  vehicleType (string): " + vehicleDto.getVehicleType());
        System.out.println("  vehicleTypeId: " + vehicleDto.getVehicleTypeId());
        System.out.println("  vehicleTypeEnum: " + vehicleDto.getVehicleTypeEnum());
        System.out.println("  isVehicleTypeValid(): " + vehicleDto.isVehicleTypeValid());

        // Validate that at least one vehicle type is provided
        if (!vehicleDto.isVehicleTypeValid()) {
            throw new IllegalArgumentException("Vehicle type is required (either vehicleTypeId, vehicleTypeEnum, or vehicleType string)");
        }

        // Get owner
        Owner owner = ownerService.findByNic(vehicleDto.getOwnerNic())
                .orElseThrow(() -> new IllegalArgumentException("Owner not found with NIC: " + vehicleDto.getOwnerNic()));

        // Get vehicle type entity
        VehicleTypeEntity vehicleType = null;
        
        if (vehicleDto.getVehicleTypeId() != null) {
            // New approach: use vehicle type ID
            vehicleType = vehicleTypeRepository.findById(vehicleDto.getVehicleTypeId())
                    .orElseThrow(() -> new IllegalArgumentException("Vehicle type not found with ID: " + vehicleDto.getVehicleTypeId()));
        } else if (vehicleDto.getVehicleType() != null && !vehicleDto.getVehicleType().trim().isEmpty()) {
            // Handle string vehicle type (like "CAR", "MOTORCYCLE", etc.)
            String vehicleTypeName = vehicleDto.getVehicleType().trim().toUpperCase();
            vehicleType = vehicleTypeRepository.findByName(vehicleTypeName)
                    .orElseThrow(() -> new IllegalArgumentException("Vehicle type not found with name: " + vehicleTypeName));
        } else if (vehicleDto.getVehicleTypeEnum() != null) {
            // Backward compatibility: convert enum to entity
            String vehicleTypeName = vehicleDto.getVehicleTypeEnum().name();
            vehicleType = vehicleTypeRepository.findByName(vehicleTypeName)
                    .orElseThrow(() -> new IllegalArgumentException("Vehicle type not found with name: " + vehicleTypeName));
        }

        // Create and save vehicle
        Vehicle vehicle = new Vehicle();
        vehicle.setVehicleNumber(vehicleDto.getVehicleNumber());
        vehicle.setChassisNumber(vehicleDto.getChassisNumber());
        vehicle.setVehicleType(vehicleType);
        vehicle.setFuelType(vehicleDto.getFuelType());
        vehicle.setOwner(owner);
        
        // Set initial weekly available quantity to the vehicle type's weekly quota
        vehicle.setWeeklyAvailableQuantity(vehicleType.getWeeklyQuota());

        // Generate QR code
        String qrCodeData = String.format("Vehicle Number: %s\nVehicle Type: %s\nOwner NIC: %s\nWeekly Quota: %.2f L",
                vehicle.getVehicleNumber(), vehicleType.getName(), owner.getNic(), vehicleType.getWeeklyQuota());
        try {
            String qrCodeBase64 = QRCodeGenerator.generateQRCode(qrCodeData, 200, 200);
            vehicle.setQrCode(qrCodeBase64); // Save QR code in the database
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate QR code", e);
        }

        return vehicleRepository.save(vehicle);
    }

    public Optional<Vehicle> findByVehicleNumber(String vehicleNumber) {
        return vehicleRepository.findByVehicleNumber(vehicleNumber);
    }

    public List<Vehicle> findVehiclesByOwnerNic(String ownerNic) {
        return vehicleRepository.findByOwnerNic(ownerNic);
    }

    public List<Vehicle> findVehiclesByOwnerId(Long ownerId) {
        return vehicleRepository.findByOwnerId(ownerId);
    }

    @Transactional
    public boolean dispenseFuel(String vehicleNumber, Double amount) {
        Vehicle vehicle = findByVehicleNumber(vehicleNumber)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found: " + vehicleNumber));
        
        if (vehicle.dispenseFuel(amount)) {
            vehicleRepository.save(vehicle);
            return true;
        }
        return false;
    }

    @Transactional
    public void resetWeeklyQuotas() {
        List<Vehicle> allVehicles = vehicleRepository.findAll();
        for (Vehicle vehicle : allVehicles) {
            vehicle.resetWeeklyQuantity();
            vehicleRepository.save(vehicle);
        }
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