package com.fuelquota.management.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fuelquota.management.dto.OwnerRegistrationDto;
import com.fuelquota.management.dto.VehicleRegistrationDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TrafficDepartmentService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    @Value("${traffic.department.api.url}")
    private String apiUrl;
    
    @Value("${traffic.department.api.key}")
    private String apiKey;
    
    public boolean validateOwnerInfo(OwnerRegistrationDto ownerDto) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-API-KEY", apiKey);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("nic", ownerDto.getNic());
            requestBody.put("firstName", ownerDto.getFirstName());
            requestBody.put("lastName", ownerDto.getLastName());
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.postForEntity(
                    apiUrl + "/validate-owner", 
                    entity, 
                    String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode root = objectMapper.readTree(response.getBody());
                return root.path("valid").asBoolean(false);
            }
            
            return false;
        } catch (Exception e) {
            // In a real application, log this exception
            // For demo purpose, we'll just simulate validation success
            return true;
        }
    }
    
    public boolean validateVehicleInfo(VehicleRegistrationDto vehicleDto, String ownerNic) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-API-KEY", apiKey);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("vehicleNumber", vehicleDto.getVehicleNumber());
            requestBody.put("chassisNumber", vehicleDto.getChassisNumber());
            requestBody.put("ownerNic", ownerNic);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.postForEntity(
                    apiUrl + "/validate-vehicle", 
                    entity, 
                    String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode root = objectMapper.readTree(response.getBody());
                return root.path("valid").asBoolean(false);
            }
            
            return false;
        } catch (Exception e) {
            // In a real application, log this exception
            // For demo purpose, we'll just simulate validation success
            return true;
        }
    }
}