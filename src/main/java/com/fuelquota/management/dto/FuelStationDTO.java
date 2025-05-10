package com.fuelquota.management.dto;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Data Transfer Object for Fuel Station information.
 * Used to transfer fuel station data between application layers.
 */
public class FuelStationDTO {
    private Long id;
    private String name;
    private String location;
    private String ownerName;
    private String contactNumber;
    private boolean active;
    private LocalDateTime createdAt;

    /**
     * Default constructor
     */
    public FuelStationDTO() {
    }

    /**
     * Full constructor for creating a complete DTO object
     */
    public FuelStationDTO(Long id, String name, String location, String ownerName, 
                         String contactNumber, boolean active, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.ownerName = ownerName;
        this.contactNumber = contactNumber;
        this.active = active;
        this.createdAt = createdAt;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getLocation() {
        return location;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public boolean isActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FuelStationDTO that = (FuelStationDTO) o;
        return active == that.active &&
               Objects.equals(id, that.id) &&
               Objects.equals(name, that.name) &&
               Objects.equals(location, that.location) &&
               Objects.equals(ownerName, that.ownerName) &&
               Objects.equals(contactNumber, that.contactNumber) &&
               Objects.equals(createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, location, ownerName, contactNumber, active, createdAt);
    }

    @Override
    public String toString() {
        return "FuelStationDTO{" +
               "id=" + id +
               ", name='" + name + '\'' +
               ", location='" + location + '\'' +
               ", ownerName='" + ownerName + '\'' +
               ", contactNumber='" + contactNumber + '\'' +
               ", active=" + active +
               ", createdAt=" + createdAt +
               '}';
    }
}