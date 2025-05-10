package com.fuelquota.management.service;

import com.fuelquota.management.dto.OwnerRegistrationDto;
import com.fuelquota.management.entity.Owner;
import com.fuelquota.management.repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OwnerService {

    private final OwnerRepository ownerRepository;

    @Autowired
    public OwnerService(OwnerRepository ownerRepository) {
        this.ownerRepository = ownerRepository;
    }

    public Owner registerOwner(OwnerRegistrationDto ownerRegistrationDto) {
        Owner owner = new Owner();
        owner.setNic(ownerRegistrationDto.getNic());
        owner.setFirstName(ownerRegistrationDto.getFirstName());
        owner.setLastName(ownerRegistrationDto.getLastName());
        owner.setEmail(ownerRegistrationDto.getEmail());
        owner.setPhone(ownerRegistrationDto.getPhone());
        owner.setAddress(ownerRegistrationDto.getAddress());
        return ownerRepository.save(owner);
    }

    // Additional methods related to owner operations can be added here
}