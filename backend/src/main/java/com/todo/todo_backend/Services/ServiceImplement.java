package com.todo.todo_backend.Services;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.quartz.SchedulerException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.todo.todo_backend.Entity.OtpEntity;
import com.todo.todo_backend.Entity.TodoEntity;
import com.todo.todo_backend.Entity.UserEntity;
import com.todo.todo_backend.Model.LoginModel;
import com.todo.todo_backend.Model.OTPModel;
import com.todo.todo_backend.Model.ProfileModel;
import com.todo.todo_backend.Model.ResetPasswordModel;
import com.todo.todo_backend.Model.SchedulerModel;
import com.todo.todo_backend.Model.SignupModel;
import com.todo.todo_backend.Model.TodoModel;
import com.todo.todo_backend.Repository.OtpRepository;
import com.todo.todo_backend.Repository.TodoRepository;
import com.todo.todo_backend.Repository.UserRepository;
import com.todo.todo_backend.Response.AuthResponse;
import com.todo.todo_backend.Security.JwtUtil;

@Service
public class ServiceImplement implements services {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    TodoRepository todoRepository;

    @Autowired
    JavaMailSender mailSender;

    @Autowired
    OtpRepository otpRepository;

    @Autowired
    SchedulerServiceImplement schedulerServiceImplement;

    @Autowired
    JwtUtil jwtUtil;

    @Override
    public String signupUser(SignupModel signupModel, MultipartFile image) throws IOException {
        UserEntity userEntity_outer = userRepository.findByEmail(signupModel.getEmail());
        if (userEntity_outer == null) {
            if ("".equals(signupModel.getName()) || "".equals(signupModel.getEmail())
                    || "".equals(signupModel.getPassword())) {
                return "Name , Email or Password is empty please fill the data correctly";
            } else {
                UserEntity userEntity = new UserEntity();
                BeanUtils.copyProperties(signupModel, userEntity);

                userEntity.setPassword(passwordEncoder.encode(signupModel.getPassword()));
                userEntity.setImg(image.getBytes());

                userRepository.save(userEntity);
                return "Data Inserted Successfully";
            }
        } else {
            return "Email already exists please try to log in first";
        }
    }

    @Override
    public AuthResponse loginUser(LoginModel loginModel) {
        UserEntity userEntity = userRepository.findByEmail(loginModel.getEmail());
        if (userEntity == null) {
            throw new RuntimeException("Email not registered. Please sign up first.");
        }
        if (!passwordEncoder.matches(loginModel.getPassword(), userEntity.getPassword())) {
            throw new RuntimeException("Incorrect password.");
        }
        String token = jwtUtil.generateToken(
                userEntity.getId(),
                userEntity.getEmail(),
                userEntity.getRole().name()
        );
        return new AuthResponse(
                userEntity.getId(),
                userEntity.getEmail(),
                userEntity.getRole().name(),
                token
        );
    }

    @Override
    public ProfileModel getUserProfile(String email) {
        UserEntity userEntity = userRepository.findByEmail(email);
        ProfileModel profileModel = new ProfileModel();
        BeanUtils.copyProperties(userEntity, profileModel);
        return profileModel;
    }

    @Override
    public String updateUserProfile(Long id, ProfileModel profileModel, MultipartFile img) throws IOException {
        UserEntity userEntity = userRepository.findById(id).get();
        userEntity.setName(profileModel.getName());
        userEntity.setEmail(profileModel.getEmail());
        userEntity.setImg(img.getBytes());
        userRepository.save(userEntity);
        return "Profile Updated Successfully";
    }

    @Override
    public String addNewTodo(TodoModel todoModel, Long userid) throws SchedulerException {
        UserEntity userEntity = userRepository.findById(userid).get();
        
        SchedulerModel schedulerModel = new SchedulerModel();
        schedulerModel.setEmail(userEntity.getEmail());
        schedulerModel.setTodoDetail(todoModel.getDescription());
        schedulerModel.setStartDate(todoModel.getStartDate());
        schedulerModel.setCompletionDate(todoModel.getCompletionDate());
        schedulerServiceImplement.scheduleCompletionReminders(schedulerModel);
        schedulerServiceImplement.scheduleStartReminders(schedulerModel);

        TodoEntity todoEntity = new TodoEntity();
        BeanUtils.copyProperties(todoModel, todoEntity);
        todoEntity.setUser(userEntity);
        todoRepository.save(todoEntity);
        return "Todo's Inserted Successfully";
    }

    @Override
    public List<TodoModel> getAllTodos(Long userId) {
        List<TodoEntity> todoEntity = todoRepository.findByUserId(userId);
        List<TodoModel> todoModels = new ArrayList<>();
        for (TodoEntity todoEntitys : todoEntity) {

            TodoModel tdm = new TodoModel();
            tdm.setId(todoEntitys.getId());
            tdm.setTitle(todoEntitys.getTitle());
            tdm.setDescription(todoEntitys.getDescription());
            tdm.setStatus(todoEntitys.getStatus());
            tdm.setStartDate(todoEntitys.getStartDate());
            tdm.setCompletionDate(todoEntitys.getCompletionDate());

            todoModels.add(tdm);
        }
        return todoModels;
    }

    @Override
    public TodoModel getTodoById(Long id) {
        TodoEntity todoEntity = todoRepository.findById(id).get();
        TodoModel todoModel = new TodoModel();
        BeanUtils.copyProperties(todoEntity, todoModel);
        return todoModel;
    }

    @Override
    public String updateTodo(Long todoId, TodoModel todoModel, Long userId) throws SchedulerException {
        UserEntity userEntity = userRepository.findById(userId).get();
        TodoEntity todoEntity = todoRepository.findById(todoId).get();

        SchedulerModel schedulerModel = new SchedulerModel();
        schedulerModel.setEmail(userEntity.getEmail());
        schedulerModel.setTodoDetail(todoModel.getDescription());
        schedulerModel.setStartDate(todoModel.getStartDate());
        schedulerModel.setCompletionDate(todoModel.getCompletionDate());

        if(!todoEntity.getStartDate().toString().equals(todoModel.getStartDate().toString())){
            schedulerServiceImplement.scheduleStartReminders(schedulerModel);
        }

        if(!todoEntity.getCompletionDate().toString().equals(todoModel.getStartDate().toString())){
            schedulerServiceImplement.scheduleCompletionReminders(schedulerModel);
        }

        todoEntity.setStatus(todoModel.getStatus());
        todoEntity.setStartDate(todoModel.getStartDate());
        todoEntity.setCompletionDate(todoModel.getCompletionDate());

        todoRepository.save(todoEntity);
        return "Updated Successfully";
    }

    @Override
    public String deleteTodo(Long id) {
        todoRepository.deleteById(id);
        return "Todo Deleted Successfully";
    }

    @Override
    public String sendSimpleMail(String email) {
        otpRepository.invalidateOtpByEmail(email);
        UserEntity userEntity = userRepository.findByEmail(email);
        if (userEntity != null) {
            String otp = "%06d".formatted(new Random().nextInt(999999));

            OtpEntity otpEntity = new OtpEntity(userEntity.getEmail(), otp, LocalDateTime.now().plusMinutes(5), false);
            otpRepository.save(otpEntity);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(userEntity.getEmail());
            message.setSubject("Password Reset OTP");
            message.setText("Your OTP is: " + otp + " (valid for 5 minutes)");
            mailSender.send(message);
            return "OTP send to your Email";
        } else {
            return "No user found on this email , Please try to Signup first";
        }
    }

    @Override
    public String validateOTP(OTPModel otpModel) {
        OtpEntity otpEntity = otpRepository.findLatestOtpByEmail(otpModel.getEmail());
        if (otpEntity != null && otpEntity.getOtp().equals(otpModel.getOtp()) && !otpEntity.getIsUsed()) {
            if (otpEntity.getExpirationTime().isBefore(LocalDateTime.now())) {
                return "OTP is Expired";
            } else {
                otpEntity.setIsUsed(true);
                otpRepository.save(otpEntity);
                return "OTP is verified";
            }
        } else {
            return "Invalid OTP";
        }
    }

    @Override
    public String passwordReset(ResetPasswordModel resetPasswordModel) {
        UserEntity userEntity = userRepository.findByEmail(resetPasswordModel.getEmail());
        if (userEntity != null) {
            userEntity.setPassword(passwordEncoder.encode(resetPasswordModel.getPassword()));
            userRepository.save(userEntity);
            return "Password reset Successfully";
        } else {
            return "Error while reseting your passwrod try after sometime";
        }
    }
}
