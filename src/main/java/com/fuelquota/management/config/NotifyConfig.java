package com.fuelquota.management.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "notifylk")
@Data
public class NotifyConfig {
    private String userId;
    private String apiKey;
    private String senderId;
    private String baseUrl;
}
