package com.todo.todo_backend.Services;

import java.io.IOException;
import java.util.List;

import org.quartz.SchedulerException;
import org.springframework.web.multipart.MultipartFile;

import com.todo.todo_backend.Model.LoginModel;
import com.todo.todo_backend.Model.OTPModel;
import com.todo.todo_backend.Model.ProfileModel;
import com.todo.todo_backend.Model.ResetPasswordModel;
import com.todo.todo_backend.Model.SignupModel;
import com.todo.todo_backend.Model.TodoModel;
import com.todo.todo_backend.Response.AuthResponse;

public interface services {
    // User Profile Related Services
    String signupUser(SignupModel signupModel, MultipartFile image) throws IOException;
    AuthResponse loginUser(LoginModel loginModel);
    ProfileModel getUserProfile(String email);
    String updateUserProfile(Long id, ProfileModel profileModel, MultipartFile file) throws IOException;

    // Todo's Related Services
    String addNewTodo(TodoModel todoModel, Long id) throws SchedulerException;
    List<TodoModel> getAllTodos(Long userId);
    TodoModel getTodoById(Long id);
    String updateTodo(Long id, TodoModel todoModel, Long userId) throws SchedulerException;
    String deleteTodo(Long id);

    // Email Service
    String sendSimpleMail(String email);

    // Validate OTP
    String validateOTP(OTPModel otpModel);

    // Reset Password
    String passwordReset(ResetPasswordModel resetPasswordModel);
}
