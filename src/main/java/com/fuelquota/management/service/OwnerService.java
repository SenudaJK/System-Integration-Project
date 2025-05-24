package com.fuelquota.management.service;

import com.fuelquota.management.dto.OwnerRegistrationDto;
import com.fuelquota.management.dto.VehicleRegistrationDto;
import com.fuelquota.management.model.OtpRecord;
import com.fuelquota.management.model.Owner;
import com.fuelquota.management.model.Vehicle;
import com.fuelquota.management.repository.OtpRepository;
import com.fuelquota.management.repository.OwnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class OwnerService {

    private final OwnerRepository ownerRepository;
    private final OtpService otpService;
    private final OtpRepository otpRepository;
    private final QrCodeService qrCodeService;
    private final VehicleService vehicleService;

    @Transactional //check email exist
    public Owner storeOwner(OwnerRegistrationDto ownerDto) {
        // Validate if the owner already exists
        Optional<Owner> existingOwner = ownerRepository.findByEmail(ownerDto.getEmail());
        if (existingOwner.isPresent()) {
            throw new IllegalArgumentException("Owner with this email already exists.");
        }

        // Create a new Owner entity
        Owner owner = new Owner();
        owner.setFirstName(ownerDto.getFirstName());
        owner.setLastName(ownerDto.getLastName());
        owner.setEmail(ownerDto.getEmail());
        owner.setPhone(ownerDto.getPhone());
        owner.setAddress(ownerDto.getAddress());
        owner.setNic(ownerDto.getNic());

        // Save the owner in the database
        return ownerRepository.save(owner);
    }

    @Transactional /* */
    public void sendVerificationOtp(String email) {
        // Validate email format (optional)
        if (!email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$")) {
            throw new IllegalArgumentException("Invalid email address");
        }

        // Generate and sent and save OTP
        otpService.generateAndSendOtp(email, OtpRecord.OtpPurpose.EMAIL_VERIFICATION);
    }

    @Transactional 
    public void sendLoginOtp(String email) {
        // Validate email format (optional)
        if (!email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$")) {
            throw new IllegalArgumentException("Invalid email address");
        }

        // Generate and sent and save OTP
        otpService.generateAndSendOtp(email, OtpRecord.OtpPurpose.LOGIN_VERIFICATION);
    }

    @Transactional
    public boolean verifyEmail(String email, String otp) {
        // Verify the OTP using the OtpRecord table
        boolean verified = otpService.verifyOtp(email, otp, OtpRecord.OtpPurpose.EMAIL_VERIFICATION);        if (verified) {
            // Fetch the OtpRecord to confirm the email exists in the OtpRecord table
            otpRepository.findByEmailAndPurpose(email, OtpRecord.OtpPurpose.EMAIL_VERIFICATION)
                    .orElseThrow(() -> new IllegalArgumentException("No OTP record found for the provided email"));

            // Check if an Owner already exists with this email
            ownerRepository.findByEmail(email);

            
        }

        return verified;
    }

    @Transactional
    public boolean verifyEmailForLogin(String email, String otp) {
        // Verify the OTP using the OtpRecord table
        boolean verified = otpService.verifyOtp(email, otp, OtpRecord.OtpPurpose.LOGIN_VERIFICATION);        if (verified) {
            // Fetch the OtpRecord to confirm the email exists in the OtpRecord table
            otpRepository.findByEmailAndPurpose(email, OtpRecord.OtpPurpose.LOGIN_VERIFICATION)
                    .orElseThrow(() -> new IllegalArgumentException("No OTP record found for the provided email"));
   
        }

        return verified;
    }

    @Transactional
    public void sendQrGenerationLink(String email) {
        Owner owner = ownerRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Owner not found with email: " + email));

        if (!owner.isEmailVerified()) {
            throw new IllegalArgumentException("Email not verified yet");
        }

        // Generate a unique token for QR code generation
        otpService.generateAndSendOtp(email, OtpRecord.OtpPurpose.QR_CODE_GENERATION);
    }

    @Transactional
    public String generateQrCode(String email, String otp) {
        boolean verified = otpService.verifyOtp(email, otp, OtpRecord.OtpPurpose.QR_CODE_GENERATION);

        if (!verified) {
            throw new IllegalArgumentException("Invalid or expired OTP");
        }

        Owner owner = ownerRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Owner not found with email: " + email));

        // Generate a unique identifier for the QR code
        String qrIdentifier = qrCodeService.generateUniqueIdentifier();
        owner.setQrCodeIdentifier(qrIdentifier);
        ownerRepository.save(owner);

        // Generate QR code data
        String qrContent = "FUELQUOTA:" + qrIdentifier + ":" + owner.getNic();

        // Generate and return QR code as Base64 string
        return qrCodeService.generateQrCodeBase64(qrContent, 300, 300);
    }

    public Optional<Owner> findByNic(String nic) {
        return ownerRepository.findByNic(nic);
    }

    public Optional<Owner> findByEmail(String email) {
        return ownerRepository.findByEmail(email);
    }

    public Owner findOwnerByEmail(String email) {
        return ownerRepository.findByEmail(email).orElse(null);
    }

    @Transactional(readOnly = true)
    public boolean checkIfEmailExists(String email) {
        return ownerRepository.findByEmail(email).isPresent();
    }    @Transactional(readOnly = true)
    public boolean isEmailVerified(String email) {
        // log.debug("Checking if email {} is verified in OtpRecord table", email);

        Optional<OtpRecord> otpRecordOptional = otpRepository.findByEmailAndPurpose(email,
                OtpRecord.OtpPurpose.EMAIL_VERIFICATION);

        if (otpRecordOptional.isPresent()) {
            OtpRecord otpRecord = otpRecordOptional.get();
            // log.debug("Fetched OtpRecord for email {}: {}", email, otpRecord);
            return otpRecord.isVerified();
        } else {
            // log.debug("No OtpRecord found for email {}", email);
            return false;
        }
    }

    /**
     * Enhanced store owner method with transaction rollback on failure
     * If OTP sending fails, the owner data will not be saved
     */
    @Transactional(rollbackFor = Exception.class)
    public Owner storeOwnerWithEmailValidation(OwnerRegistrationDto ownerDto) {
        log.info("Starting registration with email validation for: {}", ownerDto.getEmail());
        
        try {
            // Step 1: Validate if the owner already exists
            Optional<Owner> existingOwner = ownerRepository.findByEmail(ownerDto.getEmail());
            if (existingOwner.isPresent()) {
                throw new IllegalArgumentException("Owner with this email already exists.");
            }

            // Step 2: Create and save Owner
            Owner owner = new Owner();
            owner.setFirstName(ownerDto.getFirstName());
            owner.setLastName(ownerDto.getLastName());
            owner.setEmail(ownerDto.getEmail());
            owner.setPhone(ownerDto.getPhone());
            owner.setAddress(ownerDto.getAddress());
            owner.setNic(ownerDto.getNic());
            
            owner = ownerRepository.save(owner);
            log.info("Owner saved successfully with ID: {}", owner.getId());

            // Step 3: Send verification email (this will throw exception if fails)
            // This is the critical step - if email fails, everything rolls back
            otpService.generateAndSendOtp(owner.getEmail(), OtpRecord.OtpPurpose.EMAIL_VERIFICATION);
            log.info("Verification OTP sent successfully to: {}", owner.getEmail());

            return owner;
              } catch (Exception e) {
            log.error("Registration failed for email: {}. Error: {}", ownerDto.getEmail(), e.getMessage(), e);
            // Transaction will automatically rollback due to @Transactional(rollbackFor = Exception.class)
            throw new RuntimeException("Registration failed: " + e.getMessage(), e);
        }
    }

    /**
     * Stores owner and vehicle in a single transaction.
     * If either operation fails, both will be rolled back.
     */
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> storeOwnerAndVehicle(OwnerRegistrationDto ownerDto) {
        try {
            log.info("Starting transactional registration for email: {}", ownerDto.getEmail());

            // Step 1: Validate if the owner already exists
            Optional<Owner> existingOwner = ownerRepository.findByEmail(ownerDto.getEmail());
            if (existingOwner.isPresent()) {
                throw new IllegalArgumentException("Owner with this email already exists.");
            }

            // Step 2: Create and save Owner
            Owner owner = new Owner();
            owner.setFirstName(ownerDto.getFirstName());
            owner.setLastName(ownerDto.getLastName());
            owner.setEmail(ownerDto.getEmail());
            owner.setPhone(ownerDto.getPhone());
            owner.setAddress(ownerDto.getAddress());
            owner.setNic(ownerDto.getNic());
            
            owner = ownerRepository.save(owner);
            log.info("Owner saved successfully with ID: {}", owner.getId());

            // Step 3: Extract vehicle details and set owner NIC
            VehicleRegistrationDto vehicleDto = ownerDto.getVehicle();
            if (vehicleDto == null) {
                throw new IllegalArgumentException("Vehicle information is required");
            }
            vehicleDto.setOwnerNic(owner.getNic());

            // Step 4: Register vehicle (this can fail and cause rollback)
            Vehicle vehicle = vehicleService.registerVehicle(vehicleDto);
            log.info("Vehicle saved successfully with ID: {}", vehicle.getId());

            // Step 5: Send verification email (this can also fail and cause rollback)
            otpService.generateAndSendOtp(owner.getEmail(), OtpRecord.OtpPurpose.EMAIL_VERIFICATION);
            log.info("Verification OTP sent successfully to: {}", owner.getEmail());

            // Prepare response data
            Map<String, Object> result = new HashMap<>();
            result.put("owner", owner);
            result.put("vehicle", vehicle);
            result.put("message", "Owner and vehicle registered successfully. Verification email sent.");

            return result;
            
        } catch (Exception e) {
            log.error("Registration failed for email: {}. Error: {}", ownerDto.getEmail(), e.getMessage(), e);
            // Transaction will automatically rollback due to @Transactional(rollbackFor = Exception.class)
            throw new RuntimeException("Registration failed: " + e.getMessage(), e);
        }
    }
}
