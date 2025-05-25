package com.fuelquota.management.service;

import com.fuelquota.management.config.NotifyConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class NotifyService {
    private final WebClient client;
    private final NotifyConfig cfg;

    @Autowired
    public NotifyService(NotifyConfig cfg, WebClient.Builder wb) {
        this.cfg = cfg;
        this.client = wb
                .baseUrl(cfg.getBaseUrl())
                .defaultHeader(HttpHeaders.CONTENT_TYPE,
                        MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .build();
    }

    public Mono<String> sendSms(String to, String message) {
        Assert.hasText(cfg.getUserId(),  "notifylk.user-id must be set");
        Assert.hasText(cfg.getApiKey(),  "notifylk.api-key must be set");
        Assert.hasText(cfg.getSenderId(),"notifylk.sender-id must be set");
        Assert.hasText(to,               "destination phone must not be empty");
        Assert.hasText(message,          "message must not be empty");

        return client.post()
                .uri("/send")
                .body(BodyInserters.fromFormData("user_id",   cfg.getUserId())
                        .with("api_key",    cfg.getApiKey())
                        .with("sender_id",  cfg.getSenderId())
                        .with("to",         to)
                        .with("message",    message))
                .retrieve()
                .bodyToMono(String.class);
    }
}


