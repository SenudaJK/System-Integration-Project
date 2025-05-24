package com.fuelquota.management.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    @Value("${server.port}")
    private String serverPort;

    @Async
    public void sendVerificationEmail(String to, String otp) {
        try {
            log.info("Attempting to send verification email to: {}", to);
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            Context context = new Context();
            context.setVariable("otp", otp);
            context.setVariable("expiryMinutes", 5);
            
            String emailContent = templateEngine.process("email-templates/verification-email", context);
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Fuel Quota System - Email Verification");
            helper.setText(emailContent, true);
            
            mailSender.send(message);
            log.info("Verification email sent successfully to: {}", to);
            
        } catch (MessagingException e) {
            log.error("Failed to send verification email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Failed to send email for verification", e);
        } catch (Exception e) {
            log.error("Unexpected error while sending verification email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Unexpected error occurred while sending email", e);
        }
    }
    
    // @Async
    // public void sendQrGenerationLink(String to, String token) {
    //     try {
    //         MimeMessage message = mailSender.createMimeMessage();
    //         MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
    //         String generationLink = "http://localhost:" + serverPort + "/api/register/generate-qr?token=" + token;
            
    //         Context context = new Context();
    //         context.setVariable("generationLink", generationLink);
            
    //         String emailContent = templateEngine.process("email-templates/qr-generation", context);
            
    //         helper.setFrom(fromEmail);
    //         helper.setTo(to);
    //         helper.setSubject("Fuel Quota System - QR Code Generation");
    //         helper.setText(emailContent, true);
            
    //         mailSender.send(message);
    //     } catch (MessagingException e) {
    //         throw new RuntimeException("Failed to send QR generation email", e);
    //     }
    // }
    
    // @Async
    // public void sendRegistrationCompleteEmail(String to, String qrCodeAttachment) {
    //     try {
    //         MimeMessage message = mailSender.createMimeMessage();
    //         MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
    //         Context context = new Context();
    //         context.setVariable("name", to.split("@")[0]);
            
    //         String emailContent = templateEngine.process("email-templates/registration-complete", context);
            
    //         helper.setFrom(fromEmail);
    //         helper.setTo(to);
    //         helper.setSubject("Fuel Quota System - Registration Complete");
    //         helper.setText(emailContent, true);
            
            
            
    //         mailSender.send(message);
    //     } catch (MessagingException e) {
    //         throw new RuntimeException("Failed to send registration complete email", e);
    //     }
    // }

    // @Async
    // public void sendSimpleEmail(String to, String subject, String text) {
    //     try {
    //         MimeMessage message = mailSender.createMimeMessage();
    //         MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

    //         helper.setFrom(fromEmail);
    //         helper.setTo(to);
    //         helper.setSubject(subject);
    //         helper.setText(text, false);

    //         mailSender.send(message);
    //     } catch (MessagingException e) {
    //         throw new RuntimeException("Failed to send email", e);
    //     }
    // }
}