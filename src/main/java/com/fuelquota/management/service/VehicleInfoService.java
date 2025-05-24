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
    public VehicleInfoDTO getInfoByQrCode(String qrCode) {
        Vehicle vehicle = vehicleRepository.findByQrCode(qrCode)
                .orElseThrow(() -> new IllegalArgumentException("Invalid QR code: " + qrCode));

        OwnerDTO ownerDTO = new OwnerDTO(
                vehicle.getOwner().getId(),
                vehicle.getOwner().getNic(),
                vehicle.getOwner().getFirstName(),
                vehicle.getOwner().getLastName(),
                vehicle.getOwner().getEmail(),
                vehicle.getOwner().getPhone(),
                vehicle.getOwner().getAddress()
        );

        VehicleInfoDTO dto = new VehicleInfoDTO(
                vehicle.getId(),
                vehicle.getVehicleNumber(),
                vehicle.getChassisNumber(),
                vehicle.getFuelType().name(),
                vehicle.getWeeklyAvailableQuantity(),
                vehicle.getWeeklyQuota(),
                vehicle.getVehicleType().getName(),
                ownerDTO
        );
        return dto;
    }
}