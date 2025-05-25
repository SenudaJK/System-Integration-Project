package com.fuelquota.management.service;

import com.fuelquota.management.dto.OrderDTO;
import com.fuelquota.management.model.Order;
import com.fuelquota.management.model.FuelStation;
import com.fuelquota.management.model.FuelType;
import com.fuelquota.management.repository.OrderRepository;
import com.fuelquota.management.repository.FuelStationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private FuelStationRepository fuelStationRepository;

    public OrderDTO createOrder(OrderDTO orderDTO) {
        if (orderDTO.getOrderAmount() <= 0) {
            throw new IllegalArgumentException("Order amount must be positive");
        }
        try {
            Order order = new Order();
            order.setOrderDate(LocalDate.parse(orderDTO.getOrderDate()));
            order.setOrderAmount(orderDTO.getOrderAmount());
            order.setFuelType(FuelType.valueOf(orderDTO.getFuelType()));

            // Associate the order with the FuelStation
            FuelStation fuelStation = fuelStationRepository.findById(orderDTO.getFuelStationId())
                    .orElseThrow(() -> new EntityNotFoundException("Fuel station not found with id: " + orderDTO.getFuelStationId()));
            order.setFuelStation(fuelStation);

            Order savedOrder = orderRepository.save(order);
            return convertToDTO(savedOrder);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid input: " + e.getMessage());
        }
    }

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void deleteOrder(Long orderId) {
        orderRepository.deleteById(orderId);
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getOrderId());
        dto.setOrderDate(order.getOrderDate().toString());
        dto.setOrderAmount(order.getOrderAmount());
        dto.setFuelType(order.getFuelType().toString());
        dto.setFuelStationId(order.getFuelStation() != null ? order.getFuelStation().getId() : null);

        // Include owner details from FuelStation
        if (order.getFuelStation() != null) {
            FuelStation fuelStation = order.getFuelStation();
            dto.setOwnerName(fuelStation.getOwnerName());
            dto.setStationName(fuelStation.getName());
            dto.setLocation(fuelStation.getLocation());
            dto.setContactNumber(fuelStation.getContactNumber());
        }

        return dto;
    }
}