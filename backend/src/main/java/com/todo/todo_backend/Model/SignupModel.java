package com.todo.todo_backend.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignupModel {
    private Long id;
    private String name;
    private String email;
    private String password;
    private byte[] img; 
}
