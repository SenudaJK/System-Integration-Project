package com.fuelquota.management.service;

import com.fuelquota.management.dto.OwnerDTO;
import com.fuelquota.management.dto.VehicleInfoDTO;
import com.fuelquota.management.model.Vehicle;
import com.fuelquota.management.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VehicleInfoService {
    private final VehicleRepository vehicleRepository;

    public VehicleInfoService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional(readOnly = true)
    public VehicleInfoDTO getInfoByQrCode(String decodedQrText) {
        // Example: Vehicle Number: BGQ-6375\n...
        String vehicleNumber = extractVehicleNumber(decodedQrText);

        Vehicle vehicle = vehicleRepository.findByVehicleNumber(vehicleNumber)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found for number: " + vehicleNumber));

        OwnerDTO ownerDTO = new OwnerDTO(
                vehicle.getOwner().getId(),
                vehicle.getOwner().getNic(),
                vehicle.getOwner().getFirstName(),
                vehicle.getOwner().getLastName(),
                vehicle.getOwner().getEmail(),
                vehicle.getOwner().getPhone(),
                vehicle.getOwner().getAddress()
        );

        return new VehicleInfoDTO(
                vehicle.getId(),
                vehicle.getVehicleNumber(),
                vehicle.getChassisNumber(),
                vehicle.getFuelType().name(),
                vehicle.getWeeklyAvailableQuantity(),
                vehicle.getWeeklyQuota(),
                vehicle.getVehicleType().getName(),
                ownerDTO
        );
    }

    private String extractVehicleNumber(String text) {
        // Pattern: "Vehicle Number: BGQ-6375"
        for (String line : text.split("\\n")) {
            if (line.startsWith("Vehicle Number:")) {
                return line.replace("Vehicle Number:", "").trim();
            }
        }
        throw new IllegalArgumentException("Vehicle number not found in QR text");
    }

}