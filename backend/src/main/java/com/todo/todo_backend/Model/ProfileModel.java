package com.todo.todo_backend.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileModel {
    private Long id;
    private String name;
    private String email;
    private byte[] img; 
}