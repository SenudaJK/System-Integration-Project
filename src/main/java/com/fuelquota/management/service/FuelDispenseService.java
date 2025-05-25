package com.fuelquota.management.service;

import com.fuelquota.management.dto.OwnerDTO;
import com.fuelquota.management.dto.PumpFuelRequest;
import com.fuelquota.management.dto.VehicleInfoDTO;
import com.fuelquota.management.model.Vehicle;
import com.fuelquota.management.repository.VehicleRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class FuelDispenseService {
    private final VehicleRepository vehicleRepository;

    public FuelDispenseService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional
    public VehicleInfoDTO dispenseFuel(PumpFuelRequest request) {
        String qrText = request.getQrCode();
        String vehicleNumber = extractVehicleNumber(qrText);

        Vehicle vehicle = vehicleRepository.findByVehicleNumber(vehicleNumber)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found for number: " + vehicleNumber));

        if (!vehicle.canDispenseFuel(request.getAmount())) {
            throw new IllegalArgumentException("Insufficient available quota");
        }

        vehicle.dispenseFuel(request.getAmount());
        vehicleRepository.save(vehicle);

        return VehicleInfoMapper.toDto(vehicle);
    }

    private String extractVehicleNumber(String text) {
        for (String line : text.split("\\n")) {
            if (line.startsWith("Vehicle Number:")) {
                return line.replace("Vehicle Number:", "").trim();
            }
        }
        throw new IllegalArgumentException("Vehicle number not found in QR text");
    }



    public class VehicleInfoMapper {
        public static VehicleInfoDTO toDto(Vehicle vehicle) {
            OwnerDTO owner = new OwnerDTO(
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
                    owner
            );
        }
    }
}

