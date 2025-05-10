package com.fuelquota.management.service;

import com.fuelquota.management.model.OtpRecord;
import com.fuelquota.management.model.OtpRecord.OtpPurpose;
import com.fuelquota.management.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepository;
    private final EmailService emailService;

    @Value("${app.otp.expiration-minutes:5}")
    private int otpExpirationMinutes;

    @Transactional
    public void generateAndSendOtp(String email, OtpRecord.OtpPurpose purpose) {
        // Delete any existing OTP records for this email and purpose
        otpRepository.deleteByEmailAndPurpose(email, purpose);

        // Generate a random 6-digit OTP
        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        // Save the OTP record in the database
        OtpRecord otpRecord = new OtpRecord();
        otpRecord.setEmail(email);
        otpRecord.setOtp(otp);
        otpRecord.setPurpose(purpose);
        otpRecord.setExpiryTime(LocalDateTime.now().plusMinutes(5)); // OTP valid for 5 minutes
        otpRecord.setVerified(false);
        otpRepository.save(otpRecord);

        // Send the OTP via email
        emailService.sendVerificationEmail(email, otp);
    }

    @Transactional
    public boolean verifyOtp(String email, String otp, OtpRecord.OtpPurpose purpose) {
        return otpRepository.findByEmailAndOtpAndPurposeAndVerifiedFalse(email, otp, purpose)
                .filter(record -> !record.isExpired())
                .map(record -> {
                    record.setVerified(true);
                    otpRepository.save(record);
                    return true;
                })
                .orElse(false);
    }

    private String generateOtp() {
        Random random = new Random();
        int number = 100000 + random.nextInt(900000);
        return String.valueOf(number);
    }
}