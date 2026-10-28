package com.example.bank.account.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class AccountRequestDto {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotBlank(message = "Account type is required")
    private String accountType;

    @NotBlank(message = "Opening date is required")
    private String openingDate;

    @NotNull(message = "Balance is required")
    @PositiveOrZero(message = "Initial balance cannot be negative")
    private Double balance;

    public AccountRequestDto() {
    }

    public AccountRequestDto(Long customerId, String accountType, String openingDate, Double balance) {
        this.customerId = customerId;
        this.accountType = accountType;
        this.openingDate = openingDate;
        this.balance = balance;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public String getOpeningDate() {
        return openingDate;
    }

    public void setOpeningDate(String openingDate) {
        this.openingDate = openingDate;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }
}

