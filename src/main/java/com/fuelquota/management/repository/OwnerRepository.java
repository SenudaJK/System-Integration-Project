package com.fuelquota.management.repository;

import com.fuelquota.management.model.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, Long> {
    Optional<Owner> findByNic(String nic);
    Optional<Owner> findByEmail(String email);
    boolean existsByNic(String nic);
    boolean existsByEmail(String email);
    Optional<Owner> findByQrCodeIdentifier(String qrCodeIdentifier);
}