package com.fuelquota.management.controller;

import com.fuelquota.management.dto.QuotaDto;
import com.fuelquota.management.service.QuotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quota")
public class QuotaController {

    @Autowired
    private QuotaService quotaService;

    @GetMapping
    public ResponseEntity<List<QuotaDto>> getAllQuotas() {
        List<QuotaDto> quotas = quotaService.getAllQuotas();
        return ResponseEntity.ok(quotas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuotaDto> getQuotaById(@PathVariable Long id) {
        QuotaDto quota = quotaService.getQuotaById(id);
        return ResponseEntity.ok(quota);
    }

    @PostMapping
    public ResponseEntity<QuotaDto> createQuota(@RequestBody QuotaDto quotaDto) {
        QuotaDto createdQuota = quotaService.createQuota(quotaDto);
        return ResponseEntity.status(201).body(createdQuota);
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuotaDto> updateQuota(@PathVariable Long id, @RequestBody QuotaDto quotaDto) {
        QuotaDto updatedQuota = quotaService.updateQuota(id, quotaDto);
        return ResponseEntity.ok(updatedQuota);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuota(@PathVariable Long id) {
        quotaService.deleteQuota(id);
        return ResponseEntity.noContent().build();
    }
}