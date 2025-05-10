package com.fuelquota.management.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class OtpRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String email;
    private String otp;
    private LocalDateTime expiryTime;
    private boolean verified;
    
    @Enumerated(EnumType.STRING)
    private OtpPurpose purpose;
    
    public enum OtpPurpose {
        EMAIL_VERIFICATION,
        QR_CODE_GENERATION
    }
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryTime);
    }
}