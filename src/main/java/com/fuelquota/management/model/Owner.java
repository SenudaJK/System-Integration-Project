package com.fuelquota.management.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Owner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nic;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    
    private String qrCodeIdentifier;
    private boolean emailVerified;
    
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private Set<Vehicle> vehicles = new HashSet<>();
    
    private LocalDateTime registrationDate;
    private LocalDateTime lastUpdated;
    
    @PrePersist
    protected void onCreate() {
        this.registrationDate = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }
}