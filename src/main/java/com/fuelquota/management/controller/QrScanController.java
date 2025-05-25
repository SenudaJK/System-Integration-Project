package com.fuelquota.management.controller;

import com.fuelquota.management.dto.QrScanRequest;
import com.fuelquota.management.dto.VehicleInfoDTO;
import com.fuelquota.management.service.VehicleInfoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Controller
@RestController
@RequestMapping("/api/scan")
@Tag(name = "QR Scan", description = "Endpoints for scanning QR codes and retrieving vehicle info")
public class QrScanController {
    private final VehicleInfoService vehicleInfoService;

    public QrScanController(VehicleInfoService vehicleInfoService) {
        this.vehicleInfoService = vehicleInfoService;
    }

    @PostMapping
    @Operation(summary = "Get vehicle and owner info by QR code")
    public ResponseEntity<VehicleInfoDTO> scanQr(@RequestBody @Valid QrScanRequest req) {
        VehicleInfoDTO info = vehicleInfoService.getInfoByQrCode(req.getQrCode());
        return ResponseEntity.ok(info);
    }
}
