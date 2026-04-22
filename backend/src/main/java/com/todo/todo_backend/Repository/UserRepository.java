package com.todo.todo_backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.todo.todo_backend.Entity.UserEntity;

@Repository
public interface  UserRepository extends JpaRepository<UserEntity,Long>{
    Optional<UserEntity> findOneByEmailAndPassword(String email,String password);
    UserEntity findByEmail(String email);
}
