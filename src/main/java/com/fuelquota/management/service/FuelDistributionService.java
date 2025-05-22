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
import org.springframework.context.ApplicationEventPublisher;
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
    
    @Autowired(required = false)
    private ApplicationEventPublisher eventPublisher;
    
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
        
        // Notify about the distribution
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
    }
    
    /**
     * Central notification method that detects environment and routes to appropriate implementation
     */
    private void notifyDistribution(FuelDistribution distribution) {
        if ("azure".equals(System.getProperty("spring.profiles.active"))) {
            notifyDistributionAzure(distribution);
        } else {
            notifyDistributionStandard(distribution);
        }
    }
    
    /**
     * Azure Service Bus integration for production environment
     */
    @Profile("azure")
    private void notifyDistributionAzure(FuelDistribution distribution) {
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
    
    /**
     * Standard notification implementation using Spring's ApplicationEventPublisher
     * This works in any environment without Azure dependencies
     */
    private void notifyDistributionStandard(FuelDistribution distribution) {
        logger.info("Standard notification: Distribution created - {}", distribution.getDistributionReference());
        
        try {
            // Create notification data
            Map<String, Object> notificationData = new HashMap<>();
            notificationData.put("distributionId", distribution.getId());
            notificationData.put("stationId", distribution.getFuelStation().getId());
            notificationData.put("stationName", distribution.getFuelStation().getName());
            notificationData.put("fuelType", distribution.getFuelType().name());
            notificationData.put("amount", distribution.getFuelAmount());
            notificationData.put("reference", distribution.getDistributionReference());
            notificationData.put("timestamp", distribution.getDistributionDate().toString());
            
            // Option 1: Use ApplicationEventPublisher if available
            if (eventPublisher != null) {
                // Publish event to the Spring application context
                eventPublisher.publishEvent(new FuelDistributionEvent(this, distribution, notificationData));
                logger.info("Published distribution event to application context");
            }
            
            // Option 2: Log the notification (fallback approach)
            logger.info("Distribution notification data: {}", notificationData);
            
            // Option 3: You could implement other notification methods here:
            // - Send an email
            // - Call a webhook
            // - Write to a message queue (e.g., RabbitMQ)
            // - Store in a notifications table in the database
            
        } catch (Exception e) {
            logger.error("Error processing standard notification for distribution", e);
        }
    }
    
    /**
     * Simple event class for Spring's application event system
     */
    public static class FuelDistributionEvent {
        private final Object source;
        private final FuelDistribution distribution;
        private final Map<String, Object> data;
        
        public FuelDistributionEvent(Object source, FuelDistribution distribution, Map<String, Object> data) {
            this.source = source;
            this.distribution = distribution;
            this.data = data;
        }
        
        public Object getSource() {
            return source;
        }
        
        public FuelDistribution getDistribution() {
            return distribution;
        }
        
        public Map<String, Object> getData() {
            return data;
        }
    }
}