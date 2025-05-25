// DTO just to wrap the incoming QR code
package com.fuelquota.management.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QrScanRequest {
    @NotBlank
    private String qrCode;
}
