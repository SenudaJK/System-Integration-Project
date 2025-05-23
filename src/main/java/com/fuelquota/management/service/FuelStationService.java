package com.fuelquota.management.service;

import com.fuelquota.management.dto.FuelStationDTO;
import com.fuelquota.management.model.FuelStation;
import com.fuelquota.management.repository.FuelStationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FuelStationService {

    private final FuelStationRepository fuelStationRepository;

    @Autowired
    public FuelStationService(FuelStationRepository fuelStationRepository) {
        this.fuelStationRepository = fuelStationRepository;
    }

    @Transactional
    public FuelStationDTO registerFuelStation(FuelStationDTO fuelStationDTO) {
        if (fuelStationRepository.findByContactNumber(fuelStationDTO.getContactNumber()).isPresent()) {
            throw new IllegalArgumentException("Contact number already exists");
        }

        FuelStation fuelStation = mapToEntity(fuelStationDTO);
        fuelStation.setActive(false); // New stations are not active until approved
        FuelStation savedFuelStation = fuelStationRepository.save(fuelStation);
        return mapToDTO(savedFuelStation);
    }

    public FuelStationDTO getFuelStationById(Long id) {
        FuelStation fuelStation = fuelStationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fuel station not found with id: " + id));
        return mapToDTO(fuelStation);
    }

    public List<FuelStationDTO> getAllFuelStations() {
        return fuelStationRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public FuelStationDTO updateFuelStation(Long id, FuelStationDTO fuelStationDTO) {
        FuelStation existingFuelStation = fuelStationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fuel station not found with id: " + id));

        // Check if contact number is being changed and if it's already in use
        if (!existingFuelStation.getContactNumber().equals(fuelStationDTO.getContactNumber()) &&
                fuelStationRepository.findByContactNumber(fuelStationDTO.getContactNumber()).isPresent()) {
            throw new IllegalArgumentException("Contact number already exists");
        }

        existingFuelStation.setName(fuelStationDTO.getName());
        existingFuelStation.setLocation(fuelStationDTO.getLocation());
        existingFuelStation.setOwnerName(fuelStationDTO.getOwnerName());
        existingFuelStation.setContactNumber(fuelStationDTO.getContactNumber());

        FuelStation updatedFuelStation = fuelStationRepository.save(existingFuelStation);
        return mapToDTO(updatedFuelStation);
    }





    private FuelStation mapToEntity(FuelStationDTO dto) {
        FuelStation fuelStation = new FuelStation();
        fuelStation.setId(dto.getId());
        fuelStation.setName(dto.getName());
        fuelStation.setLocation(dto.getLocation());
        fuelStation.setOwnerName(dto.getOwnerName());
        fuelStation.setContactNumber(dto.getContactNumber());
        fuelStation.setActive(dto.isActive());
        fuelStation.setCreatedAt(dto.getCreatedAt());
        return fuelStation;
    }

    private FuelStationDTO mapToDTO(FuelStation fuelStation) {
        return new FuelStationDTO(
                fuelStation.getId(),
                fuelStation.getName(),
                fuelStation.getLocation(),
                fuelStation.getOwnerName(),
                fuelStation.getContactNumber(),
                fuelStation.isActive(),
                fuelStation.getCreatedAt()
        );
    }
}