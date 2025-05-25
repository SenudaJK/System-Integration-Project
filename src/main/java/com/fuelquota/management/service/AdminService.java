package com.fuelquota.management.service;

import com.fuelquota.management.exception.ResourceNotFoundException;
import com.fuelquota.management.model.FuelStation;
import com.fuelquota.management.model.Transaction;
import com.fuelquota.management.repository.FuelStationRepository;
import com.fuelquota.management.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private FuelStationRepository fuelStationRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public List<FuelStation> getAllFuelStations() {
        return fuelStationRepository.findAll();
    }

    public void approveFuelStation(Long id) {
        FuelStation station = fuelStationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fuel station not found"));
        station.setActive(true);
        fuelStationRepository.save(station);
    }

    public void deactivateFuelStation(Long id) {
        FuelStation station = fuelStationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fuel station not found"));
        station.setActive(false);
        fuelStationRepository.save(station);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}