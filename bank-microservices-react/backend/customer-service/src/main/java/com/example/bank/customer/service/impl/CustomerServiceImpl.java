package com.example.bank.customer.service.impl;

import com.example.bank.customer.dto.CustomerRequestDto;
import com.example.bank.customer.dto.CustomerResponseDto;
import com.example.bank.customer.entity.Customer;
import com.example.bank.customer.repository.CustomerRepository;
import com.example.bank.customer.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerResponseDto> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponseDto getCustomerById(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found with id: " + customerId));
        return mapToDto(customer);
    }

    @Override
    public CustomerResponseDto createCustomer(CustomerRequestDto request) {
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Customer already exists with email: " + request.getEmail());
        }

        Customer customer = new Customer(
                request.getName(),
                request.getEmail(),
                request.getDateOfBirth(),
                request.getGender(),
                request.getCity()
        );

        Customer saved = customerRepository.save(customer);
        return mapToDto(saved);
    }

    @Override
    public CustomerResponseDto updateCustomer(Long customerId, CustomerRequestDto request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found with id: " + customerId));

        if (!customer.getEmail().equalsIgnoreCase(request.getEmail()) && customerRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use: " + request.getEmail());
        }

        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setDateOfBirth(request.getDateOfBirth());
        customer.setGender(request.getGender());
        customer.setCity(request.getCity());

        Customer updated = customerRepository.save(customer);
        return mapToDto(updated);
    }

    @Override
    public void deleteCustomer(Long customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found with id: " + customerId);
        }
        customerRepository.deleteById(customerId);
    }

    private CustomerResponseDto mapToDto(Customer entity) {
        return new CustomerResponseDto(
                entity.getCustomerId(),
                entity.getName(),
                entity.getEmail(),
                entity.getDateOfBirth(),
                entity.getGender(),
                entity.getCity()
        );
    }
}

