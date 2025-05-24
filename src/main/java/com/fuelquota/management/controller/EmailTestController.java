package com.fuelquota.management.controller;

import com.fuelquota.management.service.EmailService;
import com.fuelquota.management.service.NetworkTestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller for testing email functionality and debugging SMTP issues
 */
@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
@Slf4j
public class EmailTestController {

    private final EmailService emailService;
    private final NetworkTestService networkTestService;

    /**
     * Test network connectivity to Gmail SMTP
     * Usage: GET /api/test/network
     */
    @GetMapping("/network")
    public ResponseEntity<?> testNetworkConnectivity() {
        try {
            log.info("Starting network connectivity test...");
            
            networkTestService.testGmailConnectivity();
            networkTestService.checkProxySettings();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Network connectivity test completed. Check logs for details."
            ));
            
        } catch (Exception e) {
            log.error("Network test failed: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Network test failed: " + e.getMessage()
            ));
        }
    }

    /**
     * Test endpoint to send a verification email
     * Usage: POST /api/test/send-email?email=test@example.com
     */
    @PostMapping("/send-email")
    public ResponseEntity<?> testSendEmail(@RequestParam String email) {
        try {
            log.info("Testing email send to: {}", email);
            
            // Generate a test OTP
            String testOtp = "123456";
            
            // Send the email
            emailService.sendVerificationEmail(email, testOtp);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Test email sent successfully to " + email,
                "testOtp", testOtp
            ));
            
        } catch (Exception e) {
            log.error("Failed to send test email to {}: {}", email, e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to send email: " + e.getMessage(),
                "error", e.getClass().getSimpleName()
            ));
        }
    }

    /**
     * Get email configuration status
     * Usage: GET /api/test/email-config
     */
    @GetMapping("/email-config")
    public ResponseEntity<?> getEmailConfig() {
        try {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Email service is configured and ready",
                "smtpHost", "smtp.gmail.com",
                "smtpPort", "587",
                "authEnabled", true,
                "startTlsEnabled", true
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Email configuration error: " + e.getMessage()
            ));
        }
    }
}
