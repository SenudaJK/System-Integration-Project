package com.fuelquota.management.service;

import com.fuelquota.management.dto.OwnerRegistrationDto;
import com.fuelquota.management.model.OtpRecord;
import com.fuelquota.management.model.Owner;
import com.fuelquota.management.repository.OtpRepository;
import com.fuelquota.management.repository.OwnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class OwnerService {

    private final OwnerRepository ownerRepository;
    private final OtpService otpService;
    private final OtpRepository otpRepository;
    private final QrCodeService qrCodeService;

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
    }

    @Transactional(readOnly = true)
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

    

    
}
