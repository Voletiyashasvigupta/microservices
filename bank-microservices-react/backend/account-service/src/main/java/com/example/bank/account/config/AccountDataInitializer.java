package com.example.bank.account.config;

import com.example.bank.account.entity.Account;
import com.example.bank.account.repository.AccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class AccountDataInitializer {

    @Bean
    CommandLineRunner initAccounts(AccountRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.saveAll(List.of(
                        new Account(1L, "SAVINGS", "2026-01-15", 25000.0),
                        new Account(1L, "CURRENT", "2026-02-10", 85000.5),
                        new Account(2L, "SAVINGS", "2026-03-05", 14200.0)
                ));
            }
        };
    }
}

