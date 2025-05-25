package com.fuelquota.management.repository;

import com.fuelquota.management.model.OtpRecord;
import com.fuelquota.management.model.OtpRecord.OtpPurpose;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpRecord, Long> {
    Optional<OtpRecord> findByEmailAndOtpAndPurposeAndVerifiedFalse(String email, String otp, OtpPurpose purpose);
    Optional<OtpRecord> findTopByEmailAndPurposeOrderByExpiryTimeDesc(String email, OtpPurpose purpose);
    Optional<OtpRecord> findByEmailAndPurpose(String email, OtpRecord.OtpPurpose purpose);
    void deleteByEmailAndPurpose(String email, OtpPurpose purpose);
}