package com.todo.todo_backend.Entity;

import java.sql.Date;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "todoList")
public class TodoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String status = "NOT_STARTED";
    private Date startDate;
    private Date completionDate;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
}
