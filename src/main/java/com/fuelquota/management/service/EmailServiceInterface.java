package com.fuelquota.management.service;

/**
 * Common interface for email services
 */
public interface EmailServiceInterface {
    void sendVerificationEmailSync(String to, String otp);
    void sendVerificationEmail(String to, String otp);
}
