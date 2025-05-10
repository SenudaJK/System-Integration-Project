package com.fuelquota.management.repository;

import com.fuelquota.management.entity.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, Long> {
    // Additional query methods can be defined here if needed
}