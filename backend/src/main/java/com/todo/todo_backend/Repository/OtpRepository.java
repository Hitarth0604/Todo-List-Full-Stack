package com.todo.todo_backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.todo.todo_backend.Entity.OtpEntity;

import jakarta.transaction.Transactional;

@Repository
public interface OtpRepository extends JpaRepository<OtpEntity,Long> {

    @Modifying
    @Transactional
    @Query("UPDATE OtpEntity o SET o.isUsed = true WHERE o.email = :email")
    void invalidateOtpByEmail(@Param("email") String email);


    @Query("SELECT o FROM OtpEntity o WHERE o.email = :email ORDER BY o.expirationTime DESC LIMIT 1")
    OtpEntity findLatestOtpByEmail(@Param("email") String email);


}
