package com.example.bank.customer.service;

import com.example.bank.customer.dto.CustomerRequestDto;
import com.example.bank.customer.dto.CustomerResponseDto;

import java.util.List;

public interface CustomerService {
    List<CustomerResponseDto> getAllCustomers();
    CustomerResponseDto getCustomerById(Long customerId);
    CustomerResponseDto createCustomer(CustomerRequestDto request);
    CustomerResponseDto updateCustomer(Long customerId, CustomerRequestDto request);
    void deleteCustomer(Long customerId);
}

