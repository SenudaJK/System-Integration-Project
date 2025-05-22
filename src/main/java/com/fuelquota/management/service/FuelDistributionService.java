package com.fuelquota.management.service;

import com.azure.core.util.Context;
import com.azure.messaging.servicebus.ServiceBusClientBuilder;
import com.azure.messaging.servicebus.ServiceBusMessage;
import com.azure.messaging.servicebus.ServiceBusSenderClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fuelquota.management.dto.FuelDistributionDTO;
import com.fuelquota.management.exception.ResourceNotFoundException;
import com.fuelquota.management.model.FuelDistribution;
import com.fuelquota.management.model.FuelDistribution.DistributionStatus;
import com.fuelquota.management.model.FuelStation;
import com.fuelquota.management.repository.FuelDistributionRepository;
import com.fuelquota.management.repository.FuelStationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FuelDistributionService {
    
    private static final Logger logger = LoggerFactory.getLogger(FuelDistributionService.class);
    
    @Autowired
    private FuelDistributionRepository distributionRepository;
    
    @Autowired
    private FuelStationRepository stationRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Value("${azure.servicebus.connection-string:}")
    private String serviceBusConnectionString;
    
    @Value("${azure.servicebus.queue.distribution:fuel-distribution-queue}")
    private String distributionQueue;
    
    @Transactional
    public FuelDistribution createDistribution(FuelDistributionDTO dto) {
        logger.info("Creating new fuel distribution for station ID: {}", dto.getFuelStationId());
        
        FuelStation station = stationRepository.findById(dto.getFuelStationId())
            .orElseThrow(() -> new ResourceNotFoundException("Fuel Station not found with id: " + dto.getFuelStationId()));
        
        FuelDistribution distribution = new FuelDistribution();
        distribution.setFuelStation(station);
        distribution.setFuelAmount(dto.getFuelAmount());
        distribution.setFuelType(dto.getFuelType());
        distribution.setStatus(DistributionStatus.PENDING);
        distribution.setDistributionDate(LocalDateTime.now());
        
        FuelDistribution saved = distributionRepository.save(distribution);
        
        // Notify about the distribution (with Azure Service Bus in production)
        notifyDistribution(saved);
        
        return saved;
    }
    
    @Transactional
    public FuelDistribution updateDistributionStatus(Long id, DistributionStatus status) {
        logger.info("Updating distribution ID: {} to status: {}", id, status);
        
        FuelDistribution distribution = distributionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Distribution not found with id: " + id));
        
        distribution.setStatus(status);
        
        if (status == DistributionStatus.DELIVERED) {
            distribution.setCompletedDate(LocalDateTime.now());
            
            // Update station's fuel inventory
            updateStationInventory(distribution);
        }
        
        return distributionRepository.save(distribution);
    }
    
    @Transactional(readOnly = true)
    public Page<FuelDistribution> getDistributionsForStation(Long stationId, DistributionStatus status, Pageable pageable) {
        FuelStation station = stationRepository.findById(stationId)
            .orElseThrow(() -> new ResourceNotFoundException("Fuel Station not found with id: " + stationId));
        
        return distributionRepository.findByFuelStationAndStatusOrderByDistributionDateDesc(station, status, pageable);
    }
    
    @Transactional(readOnly = true)
    public List<FuelDistribution> getRecentDistributions(int limit) {
        return distributionRepository.findAll(Pageable.ofSize(limit)).getContent();
    }
    
    @Transactional(readOnly = true)
    public Map<String, Double> getFuelDistributionStatsByType() {
        Map<String, Double> stats = new HashMap<>();
        
        for (FuelDistribution.FuelType type : FuelDistribution.FuelType.values()) {
            List<FuelDistribution> distributions = distributionRepository.findByFuelType(type);
            double total = distributions.stream()
                .filter(d -> d.getStatus() == DistributionStatus.DELIVERED)
                .mapToDouble(FuelDistribution::getFuelAmount)
                .sum();
            stats.put(type.name(), total);
        }
        
        return stats;
    }
    
    private void updateStationInventory(FuelDistribution distribution) {
        // In a real application, you would update the station's inventory levels
        logger.info("Updating fuel inventory for station ID: {} with {} liters of {}", 
                   distribution.getFuelStation().getId(),
                   distribution.getFuelAmount(),
                   distribution.getFuelType());
        
        // Implementation would depend on your inventory model
    }
    
    // Azure Service Bus integration for production environment
    @Profile("azure")
    private void notifyDistribution(FuelDistribution distribution) {
        logger.info("Sending distribution notification to Azure Service Bus: {}", distribution.getDistributionReference());
        
        try {
            if (serviceBusConnectionString != null && !serviceBusConnectionString.isEmpty()) {
                ServiceBusSenderClient senderClient = new ServiceBusClientBuilder()
                    .connectionString(serviceBusConnectionString)
                    .sender()
                    .queueName(distributionQueue)
                    .buildClient();
                
                Map<String, Object> messageBody = new HashMap<>();
                messageBody.put("distributionId", distribution.getId());
                messageBody.put("stationId", distribution.getFuelStation().getId());
                messageBody.put("stationName", distribution.getFuelStation().getName());
                messageBody.put("fuelType", distribution.getFuelType().name());
                messageBody.put("amount", distribution.getFuelAmount());
                messageBody.put("reference", distribution.getDistributionReference());
                messageBody.put("timestamp", distribution.getDistributionDate().toString());
                
                String messageJson = objectMapper.writeValueAsString(messageBody);
                ServiceBusMessage message = new ServiceBusMessage(messageJson);
                message.setContentType("application/json");
                message.setSubject("FuelDistribution");
                message.setMessageId(distribution.getDistributionReference());
                
                senderClient.sendMessage(message);
                senderClient.close();
                
                logger.info("Distribution notification sent successfully");
            } else {
                logger.info("Azure Service Bus not configured - skipping notification");
            }
        } catch (Exception e) {
            logger.error("Error sending distribution notification to Azure Service Bus", e);
        }
    }
    
    // Non-Azure notification for local development
    @Profile("!azure")
    private void notifyDistribution(FuelDistribution distribution) {
        logger.info("Local development: Distribution created - {}", distribution.getDistributionReference());
    }
}