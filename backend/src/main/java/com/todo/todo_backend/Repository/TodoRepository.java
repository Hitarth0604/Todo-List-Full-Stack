package com.todo.todo_backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.todo.todo_backend.Entity.TodoEntity;

@Repository
public interface TodoRepository extends JpaRepository<TodoEntity,Long>{
    List<TodoEntity> findByUserId(Long userId);
    
}
