package com.todo.todo_backend.Model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OTPModel {
    private String email;
    private String otp;
    private LocalDateTime expirationTime;
    private LocalDateTime createdTime;

    public OTPModel(String email, String otp, LocalDateTime expirationTime) {
        this.email = email;
        this.otp = otp;
        this.expirationTime = expirationTime;
        this.createdTime = LocalDateTime.now();
    }
    
}
