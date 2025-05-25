package com.fuelquota.management.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

/**
 * Service to test network connectivity to email servers
 */
@Service
@Slf4j
public class NetworkTestService {

    /**
     * Test connectivity to Gmail SMTP servers
     */
    public void testGmailConnectivity() {
        log.info("Testing Gmail SMTP connectivity...");
        
        // Test both ports
        testConnection("smtp.gmail.com", 587, "STARTTLS");
        testConnection("smtp.gmail.com", 465, "SSL");
        
        // Test DNS resolution
        testDnsResolution("smtp.gmail.com");
    }

    private void testConnection(String host, int port, String protocol) {
        try {
            log.info("Testing {}:{} ({})", host, port, protocol);
            
            Socket socket = new Socket();
            socket.connect(new InetSocketAddress(host, port), 5000); // 5 second timeout
            socket.close();
            
            log.info("✅ Successfully connected to {}:{} ({})", host, port, protocol);
            
        } catch (IOException e) {
            log.error("❌ Failed to connect to {}:{} ({}): {}", host, port, protocol, e.getMessage());
            
            // Additional diagnostics
            if (e instanceof ConnectException) {
                log.error("   → Connection refused - server might be down or port blocked");
            } else if (e instanceof SocketTimeoutException) {
                log.error("   → Connection timeout - network or firewall issue");
            } else if (e instanceof UnknownHostException) {
                log.error("   → DNS resolution failed");
            }
        }
    }

    private void testDnsResolution(String hostname) {
        try {
            log.info("Testing DNS resolution for {}", hostname);
            InetAddress address = InetAddress.getByName(hostname);
            log.info("✅ DNS resolved {} to {}", hostname, address.getHostAddress());
        } catch (UnknownHostException e) {
            log.error("❌ DNS resolution failed for {}: {}", hostname, e.getMessage());
        }
    }

    /**
     * Test if proxy settings might be interfering
     */
    public void checkProxySettings() {
        log.info("Checking proxy settings...");
        
        String httpProxy = System.getProperty("http.proxy");
        String httpsProxy = System.getProperty("https.proxy");
        String noProxy = System.getProperty("no.proxy");
        
        if (httpProxy != null) {
            log.info("HTTP Proxy: {}", httpProxy);
        }
        if (httpsProxy != null) {
            log.info("HTTPS Proxy: {}", httpsProxy);
        }
        if (noProxy != null) {
            log.info("No Proxy: {}", noProxy);
        }
        
        if (httpProxy == null && httpsProxy == null) {
            log.info("No proxy settings detected");
        }
    }
}
