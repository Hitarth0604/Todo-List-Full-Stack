package com.todo.todo_backend.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@Entity
@Table(name="otp")
@AllArgsConstructor
public class OtpEntity  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, length = 6)
    private String otp;

    @Column(nullable = false)
    private LocalDateTime expirationTime;

    @Column(nullable = false)
    private LocalDateTime createdTime;

    private Boolean isUsed;

    public OtpEntity() {}

    public OtpEntity(String email, String otp, LocalDateTime expirationTime, Boolean isUsed) {
        this.email = email;
        this.otp = otp;
        this.expirationTime = expirationTime;
        this.createdTime = LocalDateTime.now();
        this.isUsed = isUsed;
    }
}