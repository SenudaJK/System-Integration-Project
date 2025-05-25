package com.fuelquota.management.controller;

import com.fuelquota.management.dto.OwnerRegistrationDto;
import com.fuelquota.management.dto.OtpVerificationDto;
import com.fuelquota.management.dto.VehicleRegistrationDto;
import com.fuelquota.management.model.Owner;
import com.fuelquota.management.model.Vehicle;
import com.fuelquota.management.service.OwnerService;
import com.fuelquota.management.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/register")
@RequiredArgsConstructor
public class OwnerRegistrationController {

    private final OwnerService ownerService;
    private final VehicleService vehicleService;

    

    // @PostMapping("/request-qr-link")
    // public ResponseEntity<?> requestQrGenerationLink(@RequestParam String email) {
    //     try {
    //         ownerService.sendQrGenerationLink(email);

    //         Map<String, String> response = new HashMap<>();
    //         response.put("message", "QR generation link sent to your email");
    //         return ResponseEntity.ok(response);
    //     } catch (Exception e) {
    //         Map<String, String> errorResponse = new HashMap<>();
    //         errorResponse.put("error", e.getMessage());
    //         return ResponseEntity.badRequest().body(errorResponse);
    //     }
    // }

    // @PostMapping("/generate-qr")
    // public ResponseEntity<?> generateQrCode(@Valid @RequestBody OtpVerificationDto verificationDto) {
    //     try {
    //         String qrCodeBase64 = ownerService.generateQrCode(
    //                 verificationDto.getEmail(),
    //                 verificationDto.getOtp());

    //         Map<String, Object> response = new HashMap<>();
    //         response.put("qrCode", qrCodeBase64);
    //         response.put("message", "QR code generated successfully");

    //         return ResponseEntity.ok(response);
    //     } catch (Exception e) {
    //         Map<String, String> errorResponse = new HashMap<>();
    //         errorResponse.put("error", e.getMessage());
    //         return ResponseEntity.badRequest().body(errorResponse);
    //     }
    // }

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/send-otp") /* */
    public ResponseEntity<?> sendOtpToEmail(@RequestParam String email) {
        try {
            // Check if the email already exists in the Owner table
            boolean emailExists = ownerService.checkIfEmailExists(email);

            if (emailExists) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Email already exists.");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Send OTP to the provided email
            ownerService.sendVerificationOtp(email);

            Map<String, String> response = new HashMap<>();
            response.put("message", "OTP sent to the provided email address.");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "An unexpected error occurred.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/send-otpForLogin") /* */
    public ResponseEntity<?> sendOtpToEmailForLogin(@RequestParam String email) {
        try {
            
            // Send OTP to the provided email
            ownerService.sendLoginOtp(email);

            Map<String, String> response = new HashMap<>();
            response.put("message", "OTP sent to the provided email address.");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "An unexpected error occurred.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/validate-otp") // * */
    public ResponseEntity<?> validateOtp(@RequestParam String email, @RequestParam String otp) {
        try {
            boolean verified = ownerService.verifyEmail(email, otp);

            if (verified) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Email verified successfully.");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid or expired OTP.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "An unexpected error occurred.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/validate-otpLogin") // * */
    public ResponseEntity<?> validateOtpLogin(@RequestParam String email, @RequestParam String otp) {
        try {
            boolean verified = ownerService.verifyEmailForLogin(email, otp);

            if (verified) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Email verified successfully.");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid or expired OTP.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "An unexpected error occurred.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }    @PostMapping("/store-ownervehicle")
    public ResponseEntity<?> storeOwnerAndVehicle(@Valid @RequestBody OwnerRegistrationDto ownerDto) {
        try {
            // Use the transactional method that handles both owner and vehicle registration
            Map<String, Object> result = ownerService.storeOwnerAndVehicle(ownerDto);
            
            Owner owner = (Owner) result.get("owner");
            Vehicle vehicle = (Vehicle) result.get("vehicle");
            String message = (String) result.get("message");

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("message", message);
            response.put("ownerId", owner.getId());
            response.put("vehicleId", vehicle.getId());
            response.put("ownerNic", owner.getNic());
            response.put("vehicleNumber", vehicle.getVehicleNumber());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

}