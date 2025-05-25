package com.fuelquota.management.service;

import com.fuelquota.management.model.VehicleTypeEntity;
import com.fuelquota.management.repository.VehicleTypeRepository;
import lombok.RequiredArgsConstructor;
import com.fuelquota.management.dto.VehicleTypeDTO;
import com.fuelquota.management.exception.ResourceNotFoundException;
import com.fuelquota.management.model.VehicleType;
import com.fuelquota.management.repository.VehicleTypeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
import java.util.stream.Collectors;

@Service
public class VehicleTypeService {
    
    private static final Logger logger = LoggerFactory.getLogger(VehicleTypeService.class);
    
    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;
    
    @Transactional
    public VehicleTypeDTO createVehicleType(VehicleTypeDTO dto) {
        logger.info("Creating new vehicle type: {}", dto.getName());
        
        if (vehicleTypeRepository.existsByName(dto.getName())) {
            throw new IllegalArgumentException("Vehicle type with name " + dto.getName() + " already exists");
        }
        
        VehicleType vehicleType = new VehicleType();
        vehicleType.setName(dto.getName());
        vehicleType.setDescription(dto.getDescription());
        vehicleType.setWeeklyQuota(dto.getWeeklyQuota());
        vehicleType.setFuelType(dto.getFuelType());
        
        VehicleType saved = vehicleTypeRepository.save(vehicleType);
        return convertToDTO(saved);
    }
    
    @Transactional(readOnly = true)
    public List<VehicleTypeDTO> getAllVehicleTypes() {
        logger.info("Retrieving all vehicle types");
        return vehicleTypeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public VehicleTypeDTO getVehicleTypeById(Long id) {
        logger.info("Retrieving vehicle type with ID: {}", id);
        VehicleType vehicleType = vehicleTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle type not found with id: " + id));
        
        return convertToDTO(vehicleType);
    }
    
    @Transactional
    public VehicleTypeDTO updateVehicleType(Long id, VehicleTypeDTO dto) {
        logger.info("Updating vehicle type with ID: {}", id);
        
        VehicleType existingType = vehicleTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle type not found with id: " + id));
        
        // Check if name is being changed and if the new name already exists
        if (!existingType.getName().equals(dto.getName()) && 
            vehicleTypeRepository.existsByName(dto.getName())) {
            throw new IllegalArgumentException("Vehicle type with name " + dto.getName() + " already exists");
        }
        
        existingType.setName(dto.getName());
        existingType.setDescription(dto.getDescription());
        existingType.setWeeklyQuota(dto.getWeeklyQuota());
        existingType.setFuelType(dto.getFuelType());
        
        VehicleType updated = vehicleTypeRepository.save(existingType);
        return convertToDTO(updated);
    }
    
    @Transactional
    public void deleteVehicleType(Long id) {
        logger.info("Deleting vehicle type with ID: {}", id);
        
        if (!vehicleTypeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Vehicle type not found with id: " + id);
        }
        
        vehicleTypeRepository.deleteById(id);
    }
    
    private VehicleTypeDTO convertToDTO(VehicleType vehicleType) {
        VehicleTypeDTO dto = new VehicleTypeDTO();
        dto.setId(vehicleType.getId());
        dto.setName(vehicleType.getName());
        dto.setDescription(vehicleType.getDescription());
        dto.setWeeklyQuota(vehicleType.getWeeklyQuota());
        dto.setFuelType(vehicleType.getFuelType());
        return dto;
    }
}
