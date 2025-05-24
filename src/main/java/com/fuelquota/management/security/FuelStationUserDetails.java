package com.fuelquota.management.security;

import com.fuelquota.management.model.FuelStation;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Collections;

public class FuelStationUserDetails implements UserDetails {

    private final FuelStation fuelStation;

    public FuelStationUserDetails(FuelStation fuelStation) {
        this.fuelStation = fuelStation;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // For simplicity, no roles are assigned. You can add roles if needed.
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return fuelStation.getPassword();
    }

    @Override
    public String getUsername() {
        return fuelStation.getContactNumber();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return fuelStation.isActive();
    }
}