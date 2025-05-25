package com.mottorVehicalDepartment.mockDB.service;

import com.mottorVehicalDepartment.mockDB.model.VehicleOwner;
import com.mottorVehicalDepartment.mockDB.repository.VehicleOwnerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OwnerService {

    private final VehicleOwnerRepository ownerRepository;

    public OwnerService(VehicleOwnerRepository ownerRepository) {
        this.ownerRepository = ownerRepository;
    }

    public List<VehicleOwner> getAllOwners() {
        return ownerRepository.findAll();
    }
}