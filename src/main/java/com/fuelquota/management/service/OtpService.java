package com.fuelquota.management.service;

import com.fuelquota.management.model.OtpRecord;
import com.fuelquota.management.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepository;
    private final EmailServiceInterface emailService;

    @Value("${app.otp.expiration-minutes:5}")
    private int otpExpirationMinutes;    @Transactional(rollbackFor = Exception.class)
    public void generateAndSendOtp(String email, OtpRecord.OtpPurpose purpose) {
        try {
            // Delete any existing OTP records for this email and purpose
            otpRepository.deleteByEmailAndPurpose(email, purpose);
            
            // Generate a random 6-digit OTP
            String otp = generateOtp();

            // Create the OTP record in memory first
            OtpRecord otpRecord = new OtpRecord();
            otpRecord.setEmail(email);
            otpRecord.setOtp(otp);
            otpRecord.setPurpose(purpose);
            otpRecord.setExpiryTime(LocalDateTime.now().plusMinutes(otpExpirationMinutes));
            otpRecord.setVerified(false);
            
            // Save the OTP record in the database
            otpRepository.save(otpRecord);
            
            // Send the OTP via email SYNCHRONOUSLY (this will throw exception if fails)
            emailService.sendVerificationEmailSync(email, otp);
            
        } catch (Exception e) {
            // If email sending fails, the transaction will rollback automatically
            // and the OTP record won't be saved
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage(), e);
        }
    }

    @Transactional //verifying the otp after input
    public boolean verifyOtp(String email, String otp, OtpRecord.OtpPurpose purpose) {
        // Fetch the OTP record for the given email and purpose
        Optional<OtpRecord> otpRecordOptional = otpRepository.findByEmailAndPurpose(email, purpose);

        if (otpRecordOptional.isEmpty()) {
            throw new IllegalArgumentException("No OTP record found for the provided email and purpose.");
        }

        OtpRecord otpRecord = otpRecordOptional.get();

        // Check if the OTP is expired
        if (otpRecord.isExpired()) {
            throw new IllegalArgumentException("OTP is expired.");
        }

        // Check if the OTP matches
        if (!otpRecord.getOtp().equals(otp)) {
            throw new IllegalArgumentException("Invalid OTP.");
        }

        // Mark the OTP as verified
        otpRecord.setVerified(true);
        otpRepository.save(otpRecord);

        return true;
    }

    private String generateOtp() {
        Random random = new Random();
        int number = 100000 + random.nextInt(900000);
        return String.valueOf(number);
    }
}