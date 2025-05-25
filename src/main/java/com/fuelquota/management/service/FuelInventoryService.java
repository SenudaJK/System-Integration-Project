package com.fuelquota.management.service;

import com.fuelquota.management.dto.FuelInventoryDTO;
import com.fuelquota.management.model.FuelInventory;
import com.fuelquota.management.model.FuelStation;
import com.fuelquota.management.model.FuelType;
import com.fuelquota.management.repository.FuelInventoryRepository;
import com.fuelquota.management.repository.FuelStationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FuelInventoryService {

    @Autowired
    private FuelInventoryRepository fuelInventoryRepository;

    @Autowired
    private FuelStationRepository fuelStationRepository;

    public List<FuelInventoryDTO> getInventoryByFuelStationId(Long fuelStationId) {
        FuelStation fuelStation = fuelStationRepository.findById(fuelStationId)
                .orElseThrow(() -> new EntityNotFoundException("Fuel station not found with id: " + fuelStationId));
        List<FuelInventory> inventories = fuelInventoryRepository.findByFuelStation(fuelStation);
        return inventories.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public FuelInventoryDTO updateFuelAmount(Long fuelStationId, FuelInventoryDTO fuelInventoryDTO) {
        FuelStation fuelStation = fuelStationRepository.findById(fuelStationId)
                .orElseThrow(() -> new EntityNotFoundException("Fuel station not found with id: " + fuelStationId));

        FuelType fuelType;
        try {
            fuelType = FuelType.valueOf(fuelInventoryDTO.getFuelType());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid fuel type: " + fuelInventoryDTO.getFuelType());
        }

        if (fuelInventoryDTO.getAmount() < 0) {
            throw new IllegalArgumentException("Fuel amount cannot be negative");
        }

        FuelInventory fuelInventory = fuelInventoryRepository.findByFuelStationAndFuelType(fuelStation, fuelType)
                .orElseGet(() -> {
                    FuelInventory newInventory = new FuelInventory();
                    newInventory.setFuelStation(fuelStation);
                    newInventory.setFuelType(fuelType);
                    return newInventory;
                });

        fuelInventory.setAmount(fuelInventoryDTO.getAmount());
        FuelInventory savedInventory = fuelInventoryRepository.save(fuelInventory);
        return convertToDTO(savedInventory);
    }

    @Transactional
    public FuelInventoryDTO updateFuelConsumed(Long fuelStationId, FuelInventoryDTO fuelInventoryDTO) {
        FuelStation fuelStation = fuelStationRepository.findById(fuelStationId)
                .orElseThrow(() -> new EntityNotFoundException("Fuel station not found with id: " + fuelStationId));

        FuelType fuelType;
        try {
            fuelType = FuelType.valueOf(fuelInventoryDTO.getFuelType());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid fuel type: " + fuelInventoryDTO.getFuelType());
        }

        if (fuelInventoryDTO.getAmount() < 0) {
            throw new IllegalArgumentException("Consumed fuel amount cannot be negative");
        }

        FuelInventory fuelInventory = fuelInventoryRepository.findByFuelStationAndFuelType(fuelStation, fuelType)
                .orElseThrow(() -> new EntityNotFoundException("Fuel inventory not found for fuel station: " + fuelStationId + " and fuel type: " + fuelType));

        double newAmount = fuelInventory.getAmount() - fuelInventoryDTO.getAmount();
        if (newAmount < 0) {
            throw new IllegalArgumentException("Insufficient fuel amount. Current: " + fuelInventory.getAmount() + ", Consumed: " + fuelInventoryDTO.getAmount());
        }

        fuelInventory.setAmount(newAmount);
        FuelInventory savedInventory = fuelInventoryRepository.save(fuelInventory);
        return convertToDTO(savedInventory);
    }

    @Transactional
    public FuelInventoryDTO restockFuelAmount(Long fuelStationId, FuelInventoryDTO fuelInventoryDTO) {
        FuelStation fuelStation = fuelStationRepository.findById(fuelStationId)
                .orElseThrow(() -> new EntityNotFoundException("Fuel station not found with id: " + fuelStationId));

        FuelType fuelType;
        try {
            fuelType = FuelType.valueOf(fuelInventoryDTO.getFuelType());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid fuel type: " + fuelInventoryDTO.getFuelType());
        }

        if (fuelInventoryDTO.getAmount() < 0) {
            throw new IllegalArgumentException("Restock fuel amount cannot be negative");
        }

        FuelInventory fuelInventory = fuelInventoryRepository.findByFuelStationAndFuelType(fuelStation, fuelType)
                .orElseGet(() -> {
                    FuelInventory newInventory = new FuelInventory();
                    newInventory.setFuelStation(fuelStation);
                    newInventory.setFuelType(fuelType);
                    newInventory.setAmount(0.0); // Initialize with zero
                    return newInventory;
                });

        double newAmount = fuelInventory.getAmount() + fuelInventoryDTO.getAmount();
        fuelInventory.setAmount(newAmount);
        FuelInventory savedInventory = fuelInventoryRepository.save(fuelInventory);
        return convertToDTO(savedInventory);
    }

    private FuelInventoryDTO convertToDTO(FuelInventory fuelInventory) {
        FuelInventoryDTO dto = new FuelInventoryDTO();
        dto.setId(fuelInventory.getId());
        dto.setFuelStationId(fuelInventory.getFuelStation().getId());
        dto.setFuelType(fuelInventory.getFuelType().toString());
        dto.setAmount(fuelInventory.getAmount());
        return dto;
    }
}