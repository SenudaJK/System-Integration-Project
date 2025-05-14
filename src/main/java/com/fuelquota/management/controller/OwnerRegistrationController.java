package com.fuelquota.management.controller;

import com.fuelquota.management.dto.OwnerRegistrationDto;
import com.fuelquota.management.dto.OtpVerificationDto;
import com.fuelquota.management.model.Owner;
import com.fuelquota.management.service.EmailService;
import com.fuelquota.management.service.OwnerService;
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
    private final EmailService emailService;

    // @PostMapping("/send-test")
    // public ResponseEntity<?> sendTestEmail(@RequestParam String to) {
    // try {
    // emailService.sendSimpleEmail(to, "Test Email", "This is a test email.");
    // return ResponseEntity.ok("Test email sent successfully to " + to);
    // } catch (Exception e) {
    // return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    // .body("Failed to send email: " + e.getMessage());
    // }
    // }

    // @PostMapping("/owner")
    // public ResponseEntity<?> registerOwner(@Valid @RequestBody
    // OwnerRegistrationDto ownerDto) {
    // try {
    // Owner owner = ownerService.registerOwner(ownerDto);

    // // Send verification email
    // ownerService.sendVerificationOtp(ownerDto.getEmail());

    // Map<String, Object> response = new HashMap<>();
    // response.put("message", "Owner registration initiated. Please verify your
    // email.");
    // response.put("ownerId", owner.getId());

    // return ResponseEntity.status(HttpStatus.CREATED).body(response);
    // } catch (IllegalArgumentException e) {
    // Map<String, String> errorResponse = new HashMap<>();
    // errorResponse.put("error", e.getMessage());
    // return ResponseEntity.badRequest().body(errorResponse);
    // } catch (Exception e) {
    // Map<String, String> errorResponse = new HashMap<>();
    // errorResponse.put("error", "An unexpected error occurred");
    // return
    // ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    // }
    // }

    // @PostMapping("/verify-email")
    // public ResponseEntity<?> verifyEmail(@Valid @RequestBody OtpVerificationDto
    // verificationDto) {
    // try {
    // boolean verified = ownerService.verifyEmail(
    // verificationDto.getEmail(),
    // verificationDto.getOtp());

    // if (verified) {
    // Map<String, String> response = new HashMap<>();
    // response.put("message", "Email verified successfully");
    // return ResponseEntity.ok(response);
    // } else {
    // Map<String, String> errorResponse = new HashMap<>();
    // errorResponse.put("error", "Invalid or expired OTP");
    // return ResponseEntity.badRequest().body(errorResponse);
    // }
    // } catch (Exception e) {
    // Map<String, String> errorResponse = new HashMap<>();
    // errorResponse.put("error", e.getMessage());
    // return ResponseEntity.badRequest().body(errorResponse);
    // }
    // }

    @PostMapping("/request-qr-link")
    public ResponseEntity<?> requestQrGenerationLink(@RequestParam String email) {
        try {
            ownerService.sendQrGenerationLink(email);

            Map<String, String> response = new HashMap<>();
            response.put("message", "QR generation link sent to your email");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/generate-qr")
    public ResponseEntity<?> generateQrCode(@Valid @RequestBody OtpVerificationDto verificationDto) {
        try {
            String qrCodeBase64 = ownerService.generateQrCode(
                    verificationDto.getEmail(),
                    verificationDto.getOtp());

            Map<String, Object> response = new HashMap<>();
            response.put("qrCode", qrCodeBase64);
            response.put("message", "QR code generated successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

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

    @PostMapping("/validate-otp")//* */
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

    @PostMapping("/store-owner")
    public ResponseEntity<?> storeOwner(@Valid @RequestBody OwnerRegistrationDto ownerDto) {
        try {
            

            // Save owner information in the database
            Owner owner = ownerService.storeOwner(ownerDto);

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Owner information stored successfully.");
            response.put("ownerId", owner.getId());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
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

    @PostMapping("/validate-and-store-owner-vehicle")
public ResponseEntity<?> validateAndStoreOwnerAndVehicle(@Valid @RequestBody OwnerVehicleDto ownerVehicleDto) {
    try {
        // Step 1: Fetch vehicle details from the third-party API
        String thirdPartyApiUrl = "http://localhost:8081/api/vehicles/by-nic?nic=" + ownerVehicleDto.getNic();
        VehicleValidationResponse thirdPartyResponse = ownerService.fetchVehicleDetailsFromThirdParty(thirdPartyApiUrl);

        // Step 2: Validate vehicle details
        boolean isValid = ownerService.validateVehicleDetails(
                thirdPartyResponse,
                ownerVehicleDto.getVehicleNumber(),
                ownerVehicleDto.getChassisNumber()
        );

        if (!isValid) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Vehicle details validation failed.");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        // Step 3: Store owner details
        Owner owner = ownerService.storeOwner(ownerVehicleDto);

        // Step 4: Store vehicle details
        ownerService.storeVehicle(owner, ownerVehicleDto);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Owner and vehicle details stored successfully.");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
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
}