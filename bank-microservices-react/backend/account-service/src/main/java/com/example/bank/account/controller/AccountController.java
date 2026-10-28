package com.example.bank.account.controller;

import com.example.bank.account.dto.AccountRequestDto;
import com.example.bank.account.dto.AccountResponseDto;
import com.example.bank.account.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    public List<AccountResponseDto> getAllAccounts() {
        return accountService.getAllAccounts();
    }

    @GetMapping("/{accountno}")
    public AccountResponseDto getAccountByNumber(@PathVariable Long accountno) {
        return accountService.getAccountByNumber(accountno);
    }

    @GetMapping("/customer/{customerId}")
    public List<AccountResponseDto> getAccountsByCustomerId(@PathVariable Long customerId) {
        return accountService.getAccountsByCustomerId(customerId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AccountResponseDto createAccount(@Valid @RequestBody AccountRequestDto request) {
        return accountService.createAccount(request);
    }

    @PutMapping("/{accountno}/balance")
    public AccountResponseDto updateBalance(@PathVariable Long accountno, @RequestParam Double balance) {
        return accountService.updateBalance(accountno, balance);
    }

    @DeleteMapping("/{accountno}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long accountno) {
        accountService.deleteAccount(accountno);
        return ResponseEntity.noContent().build();
    }
}

