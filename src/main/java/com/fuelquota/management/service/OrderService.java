package com.fuelquota.management.service;

import com.fuelquota.management.dto.OrderDTO;
import com.fuelquota.management.model.Order;
import com.fuelquota.management.model.FuelType;
import com.fuelquota.management.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public OrderDTO createOrder(OrderDTO orderDTO) {
        if (orderDTO.getOrderAmount() <= 0) {
            throw new IllegalArgumentException("Order amount must be positive");
        }
        try {
            Order order = new Order();
            order.setOrderDate(LocalDate.parse(orderDTO.getOrderDate()));
            order.setOrderAmount(orderDTO.getOrderAmount());
            order.setFuelType(FuelType.valueOf(orderDTO.getFuelType()));
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
        return dto;
    }
}