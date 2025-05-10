package com.fuelquota.management.repository;

import com.fuelquota.management.entity.Quota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuotaRepository extends JpaRepository<Quota, Long> {
    // Additional query methods can be defined here if needed
}