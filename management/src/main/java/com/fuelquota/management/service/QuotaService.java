package com.fuelquota.management.service;

import com.fuelquota.management.dto.QuotaDto;
import com.fuelquota.management.entity.Quota;
import com.fuelquota.management.repository.QuotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuotaService {

    @Autowired
    private QuotaRepository quotaRepository;

    public List<Quota> getAllQuotas() {
        return quotaRepository.findAll();
    }

    public Optional<Quota> getQuotaById(Long id) {
        return quotaRepository.findById(id);
    }

    public Quota createQuota(QuotaDto quotaDto) {
        Quota quota = new Quota();
        // Set properties from quotaDto to quota
        // Example: quota.setAmount(quotaDto.getAmount());
        return quotaRepository.save(quota);
    }

    public Quota updateQuota(Long id, QuotaDto quotaDto) {
        Quota quota = quotaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quota not found with id " + id));
        // Update properties from quotaDto to quota
        // Example: quota.setAmount(quotaDto.getAmount());
        return quotaRepository.save(quota);
    }

    public void deleteQuota(Long id) {
        quotaRepository.deleteById(id);
    }
}