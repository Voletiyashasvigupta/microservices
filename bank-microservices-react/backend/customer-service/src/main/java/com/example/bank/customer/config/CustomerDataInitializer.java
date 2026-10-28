package com.example.bank.customer.config;

import com.example.bank.customer.entity.Customer;
import com.example.bank.customer.repository.CustomerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class CustomerDataInitializer {

    @Bean
    CommandLineRunner initCustomers(CustomerRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.saveAll(List.of(
                        new Customer("Alice Johnson", "alice.johnson@example.com", "1992-04-12", "Female", "Mumbai"),
                        new Customer("Rahul Sharma", "rahul.sharma@example.com", "1988-11-23", "Male", "Bengaluru"),
                        new Customer("Priya Patel", "priya.patel@example.com", "1995-08-30", "Female", "Ahmedabad")
                ));
            }
        };
    }
}

