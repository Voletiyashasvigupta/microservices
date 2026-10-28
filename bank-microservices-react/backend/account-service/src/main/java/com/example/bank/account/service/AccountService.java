package com.example.bank.account.service;

import com.example.bank.account.dto.AccountRequestDto;
import com.example.bank.account.dto.AccountResponseDto;

import java.util.List;

public interface AccountService {
    List<AccountResponseDto> getAllAccounts();
    AccountResponseDto getAccountByNumber(Long accountno);
    List<AccountResponseDto> getAccountsByCustomerId(Long customerId);
    AccountResponseDto createAccount(AccountRequestDto request);
    AccountResponseDto updateBalance(Long accountno, Double newBalance);
    void deleteAccount(Long accountno);
}

