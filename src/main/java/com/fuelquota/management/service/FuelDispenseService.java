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
        Vehicle vehicle = vehicleRepository.findByQrCode(request.getQrCode())
                .orElseThrow(() -> new IllegalArgumentException("Invalid QR code: " + request.getQrCode()));

        if (!vehicle.canDispenseFuel(request.getAmount())) {
            throw new IllegalArgumentException("Insufficient available quota");
        }

        vehicle.dispenseFuel(request.getAmount());
        vehicleRepository.save(vehicle);

        return VehicleInfoMapper.toDto(vehicle);
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

