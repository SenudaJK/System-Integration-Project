package com.fuelquota.management.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

/**
 * Mock email service for development when real email service is not available
 * Enable by setting: app.email.mock=true in application.properties
 */
@Service("mockEmailService")
@ConditionalOnProperty(name = "app.email.mock", havingValue = "true")
@Slf4j
public class MockEmailService implements EmailServiceInterface {

    @Override
    public void sendVerificationEmailSync(String to, String otp) {
        log.info("📧 MOCK EMAIL SENT 📧");
        log.info("To: {}", to);
        log.info("OTP: {}", otp);
        log.info("Subject: Fuel Quota System - Email Verification");
        log.info("Content: Your verification code is: {}", otp);
        log.info("📧 EMAIL MOCK COMPLETE 📧");
        
        // Simulate processing time
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    @Override
    public void sendVerificationEmail(String to, String otp) {
        sendVerificationEmailSync(to, otp);
    }
}
