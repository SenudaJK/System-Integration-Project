package com.fuelquota.management.service;

import com.fuelquota.management.model.VehicleTypeEntity;
import com.fuelquota.management.repository.VehicleTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VehicleTypeService {

    private final VehicleTypeRepository vehicleTypeRepository;

    public List<VehicleTypeEntity> getAllVehicleTypes() {
        return vehicleTypeRepository.findAll();
    }

    public Optional<VehicleTypeEntity> getVehicleTypeById(Long id) {
        return vehicleTypeRepository.findById(id);
    }

    public Optional<VehicleTypeEntity> getVehicleTypeByName(String name) {
        return vehicleTypeRepository.findByName(name);
    }

    public List<VehicleTypeEntity> getVehicleTypesByFuelType(VehicleTypeEntity.FuelType fuelType) {
        return vehicleTypeRepository.findByFuelType(fuelType);
    }

    @Transactional
    public VehicleTypeEntity createVehicleType(VehicleTypeEntity vehicleType) {
        if (vehicleTypeRepository.existsByName(vehicleType.getName())) {
            throw new IllegalArgumentException("Vehicle type with name '" + vehicleType.getName() + "' already exists");
        }
        return vehicleTypeRepository.save(vehicleType);
    }

    @Transactional
    public VehicleTypeEntity updateVehicleType(Long id, VehicleTypeEntity vehicleType) {
        VehicleTypeEntity existingType = vehicleTypeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle type not found with ID: " + id));

        existingType.setName(vehicleType.getName());
        existingType.setDescription(vehicleType.getDescription());
        existingType.setFuelType(vehicleType.getFuelType());
        existingType.setWeeklyQuota(vehicleType.getWeeklyQuota());

        return vehicleTypeRepository.save(existingType);
    }

    @Transactional
    public void deleteVehicleType(Long id) {
        if (!vehicleTypeRepository.existsById(id)) {
            throw new IllegalArgumentException("Vehicle type not found with ID: " + id);
        }
        vehicleTypeRepository.deleteById(id);
    }

    @Transactional
    public VehicleTypeEntity updateWeeklyQuota(Long id, Double newQuota) {
        VehicleTypeEntity vehicleType = vehicleTypeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle type not found with ID: " + id));

        vehicleType.setWeeklyQuota(newQuota);
        return vehicleTypeRepository.save(vehicleType);
    }
}
