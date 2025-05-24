package com.fuelquota.management.config;

import com.fuelquota.management.model.VehicleTypeEntity;
import com.fuelquota.management.repository.VehicleTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class VehicleTypeDataInitializer implements CommandLineRunner {

    private final VehicleTypeRepository vehicleTypeRepository;    @Override
    public void run(String... args) throws Exception {
        try {
            if (vehicleTypeRepository.count() == 0) {
                log.info("Initializing vehicle types with default data...");
                initializeVehicleTypes();
            } else {
                log.info("Vehicle types already exist, skipping initialization.");
            }
        } catch (Exception e) {
            log.error("Error initializing vehicle types: {}", e.getMessage());
            // Don't fail the application startup if vehicle type initialization fails
        }
    }private void initializeVehicleTypes() {
        // Create default vehicle types with weekly quotas matching your database fuel types
        VehicleTypeEntity motorcycle = new VehicleTypeEntity();
        motorcycle.setName("MOTORCYCLE");
        motorcycle.setDescription("Two-wheeler motorcycle");
        motorcycle.setFuelType(VehicleTypeEntity.FuelType.PETROL);
        motorcycle.setWeeklyQuota(4.0); // 4 liters per week

        VehicleTypeEntity threeWheeler = new VehicleTypeEntity();
        threeWheeler.setName("THREE_WHEELER");
        threeWheeler.setDescription("Three-wheeler vehicle");
        threeWheeler.setFuelType(VehicleTypeEntity.FuelType.PETROL);
        threeWheeler.setWeeklyQuota(6.0); // 6 liters per week

        VehicleTypeEntity car = new VehicleTypeEntity();
        car.setName("CAR");
        car.setDescription("Personal car");
        car.setFuelType(VehicleTypeEntity.FuelType.PETROL);
        car.setWeeklyQuota(20.0); // 20 liters per week

        VehicleTypeEntity van = new VehicleTypeEntity();
        van.setName("VAN");
        van.setDescription("Commercial van");
        van.setFuelType(VehicleTypeEntity.FuelType.DIESEL);
        van.setWeeklyQuota(40.0); // 40 liters per week

        VehicleTypeEntity bus = new VehicleTypeEntity();
        bus.setName("BUS");
        bus.setDescription("Public transport bus");
        bus.setFuelType(VehicleTypeEntity.FuelType.DIESEL);
        bus.setWeeklyQuota(200.0); // 200 liters per week

        VehicleTypeEntity lorry = new VehicleTypeEntity();
        lorry.setName("LORRY");
        lorry.setDescription("Small lorry");
        lorry.setFuelType(VehicleTypeEntity.FuelType.DIESEL);
        lorry.setWeeklyQuota(100.0); // 100 liters per week

        VehicleTypeEntity truck = new VehicleTypeEntity();
        truck.setName("TRUCK");
        truck.setDescription("Large truck");
        truck.setFuelType(VehicleTypeEntity.FuelType.DIESEL);
        truck.setWeeklyQuota(300.0); // 300 liters per week

        VehicleTypeEntity heavyVehicle = new VehicleTypeEntity();
        heavyVehicle.setName("HEAVY_VEHICLE");
        heavyVehicle.setDescription("Heavy industrial vehicle");
        heavyVehicle.setFuelType(VehicleTypeEntity.FuelType.DIESEL);
        heavyVehicle.setWeeklyQuota(500.0); // 500 liters per week

        // Save all vehicle types
        vehicleTypeRepository.save(motorcycle);
        vehicleTypeRepository.save(threeWheeler);
        vehicleTypeRepository.save(car);
        vehicleTypeRepository.save(van);
        vehicleTypeRepository.save(bus);
        vehicleTypeRepository.save(lorry);
        vehicleTypeRepository.save(truck);
        vehicleTypeRepository.save(heavyVehicle);

        log.info("Vehicle types initialized successfully with {} entries.", vehicleTypeRepository.count());
    }
}
