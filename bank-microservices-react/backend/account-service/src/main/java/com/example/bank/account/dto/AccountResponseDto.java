package com.example.bank.account.dto;

public class AccountResponseDto {

    private Long accountno;
    private Long customerId;
    private String accountType;
    private String openingDate;
    private Double balance;

    public AccountResponseDto() {
    }

    public AccountResponseDto(Long accountno, Long customerId, String accountType, String openingDate, Double balance) {
        this.accountno = accountno;
        this.customerId = customerId;
        this.accountType = accountType;
        this.openingDate = openingDate;
        this.balance = balance;
    }

    public Long getAccountno() {
        return accountno;
    }

    public void setAccountno(Long accountno) {
        this.accountno = accountno;
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

