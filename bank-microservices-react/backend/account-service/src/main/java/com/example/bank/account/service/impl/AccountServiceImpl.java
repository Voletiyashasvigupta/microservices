package com.example.bank.account.service.impl;

import com.example.bank.account.dto.AccountRequestDto;
import com.example.bank.account.dto.AccountResponseDto;
import com.example.bank.account.entity.Account;
import com.example.bank.account.repository.AccountRepository;
import com.example.bank.account.service.AccountService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;

    public AccountServiceImpl(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountResponseDto> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AccountResponseDto getAccountByNumber(Long accountno) {
        Account account = accountRepository.findById(accountno)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found with account number: " + accountno));
        return mapToDto(account);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountResponseDto> getAccountsByCustomerId(Long customerId) {
        return accountRepository.findByCustomerId(customerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AccountResponseDto createAccount(AccountRequestDto request) {
        Account account = new Account(
                request.getCustomerId(),
                request.getAccountType(),
                request.getOpeningDate(),
                request.getBalance()
        );

        Account saved = accountRepository.save(account);
        return mapToDto(saved);
    }

    @Override
    public AccountResponseDto updateBalance(Long accountno, Double newBalance) {
        if (newBalance < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Account balance cannot be negative");
        }

        Account account = accountRepository.findById(accountno)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found with account number: " + accountno));

        account.setBalance(newBalance);
        Account updated = accountRepository.save(account);
        return mapToDto(updated);
    }

    @Override
    public void deleteAccount(Long accountno) {
        if (!accountRepository.existsById(accountno)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found with account number: " + accountno);
        }
        accountRepository.deleteById(accountno);
    }

    private AccountResponseDto mapToDto(Account entity) {
        return new AccountResponseDto(
                entity.getAccountno(),
                entity.getCustomerId(),
                entity.getAccountType(),
                entity.getOpeningDate(),
                entity.getBalance()
        );
    }
}

