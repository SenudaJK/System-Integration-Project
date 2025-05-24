package com.fuelquota.management.controller;

import com.fuelquota.management.dto.PumpFuelRequest;
import com.fuelquota.management.dto.VehicleInfoDTO;
import com.fuelquota.management.service.FuelDispenseService;
import com.fuelquota.management.service.NotifyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vehicles")
@Tag(name = "Fuel Dispense", description = "Endpoints for dispensing fuel, updating quotas, and sending SMS")
public class FuelDispenseController {
    private final FuelDispenseService fuelDispenseService;
    private final NotifyService       notifyService;

    public FuelDispenseController(FuelDispenseService fuelDispenseService,
                                  NotifyService notifyService) {
        this.fuelDispenseService = fuelDispenseService;
        this.notifyService       = notifyService;
    }

    @PutMapping("/dispense")
    @Operation(summary = "Dispense fuel, update quota, and send SMS notification")
    public ResponseEntity<VehicleInfoDTO> dispenseFuel(@RequestBody @Valid PumpFuelRequest request) {
        VehicleInfoDTO updated = fuelDispenseService.dispenseFuel(request);
        double dispensed = request.getAmount();
        double remaining = updated.getWeeklyAvailableQuantity();
        String  Phone  = updated.getOwner().getPhone();
        String  to        = normalizeToE164(Phone);
        String  msg       = String.format(
                "You have just received %.2f L. Your remaining weekly quota is %.2f L.",
                dispensed, remaining
        );
        notifyService.sendSms(to, msg)
                .doOnError(err ->
                        System.err.println("SMS send failed: " + err.getMessage()))
                .subscribe();
        return ResponseEntity.ok(updated);
    }

    private String normalizeToE164(String localNumber) {
        String digits = localNumber.replaceAll("\\D+", "");
        if (digits.startsWith("0")) {
            digits = "94" + digits.substring(1);
        }
        return digits;
    }
}
