package com.fuelquota.management.security;

import com.fuelquota.management.model.FuelStation;
import com.fuelquota.management.repository.FuelStationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@Primary
public class FuelStationUserDetailsService implements UserDetailsService {

    private final FuelStationRepository fuelStationRepository;

    @Autowired
    public FuelStationUserDetailsService(FuelStationRepository fuelStationRepository) {
        this.fuelStationRepository = fuelStationRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String contactNumber) throws UsernameNotFoundException {
        FuelStation fuelStation = fuelStationRepository.findByContactNumber(contactNumber)
                .orElseThrow(() -> new UsernameNotFoundException("Fuel station not found with contact number: " + contactNumber));
        return new FuelStationUserDetails(fuelStation);
    }
}