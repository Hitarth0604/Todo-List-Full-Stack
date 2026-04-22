package com.todo.todo_backend.Controller;

import com.todo.todo_backend.Model.*;
import com.todo.todo_backend.Response.ApiResponse;
import com.todo.todo_backend.Response.AuthResponse;
import com.todo.todo_backend.Services.ServiceImplement;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Todo API", description = "Full CRUD + Auth + RBAC")
public class Controller {

    @Autowired
    ServiceImplement serviceImplement;

    @GetMapping("/error")
    public ResponseEntity<ApiResponse<String>> customError() {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("404 Page Not Found"));
    }

    // ── Auth ────────────────────────────────────────────────────────────

    @Operation(summary = "Register a new user")
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<String>> signupUser(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam MultipartFile image) throws IOException {

        SignupModel signupModel = new SignupModel();
        signupModel.setName(name);
        signupModel.setEmail(email);
        signupModel.setPassword(password);
        String result = serviceImplement.signupUser(signupModel, image);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered", result));
    }

    @Operation(summary = "Login — returns JWT token")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> loginUser(@Valid @RequestBody LoginModel loginModel) {
        AuthResponse authResponse = serviceImplement.loginUser(loginModel);
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }

    // ── Profile ─────────────────────────────────────────────────────────

    @Operation(summary = "Get user profile", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/profile/{email}")
    public ResponseEntity<ApiResponse<ProfileModel>> getUserProfile(@PathVariable String email) {
        return ResponseEntity.ok(ApiResponse.success("Profile fetched",
                serviceImplement.getUserProfile(email)));
    }

    @Operation(summary = "Update user profile", security = @SecurityRequirement(name = "bearerAuth"))
    @PutMapping("/profile/{id}")
    public ResponseEntity<ApiResponse<String>> updateUserProfile(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam("image") MultipartFile img) throws IOException {
        ProfileModel profileModel = new ProfileModel();
        profileModel.setName(name);
        profileModel.setEmail(email);
        return ResponseEntity.ok(ApiResponse.success("Profile updated",
                serviceImplement.updateUserProfile(id, profileModel, img)));
    }

    // ── Todos ────────────────────────────────────────────────────────────

    @Operation(summary = "Add new todo (USER / ADMIN)", security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping("/addtodo/{userid}")
    public ResponseEntity<ApiResponse<String>> addTodo(
            @Valid @RequestBody TodoModel todoModel,
            @PathVariable Long userid) throws SchedulerException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Todo created",
                        serviceImplement.addNewTodo(todoModel, userid)));
    }

    @Operation(summary = "Get all todos for a user", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/gettodo/{userid}")
    public ResponseEntity<ApiResponse<List<TodoModel>>> listAllTodo(@PathVariable Long userid) {
        return ResponseEntity.ok(ApiResponse.success("Todos fetched",
                serviceImplement.getAllTodos(userid)));
    }

    @Operation(summary = "Get todo by ID", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/gettodobyid/{id}")
    public ResponseEntity<ApiResponse<TodoModel>> getTodoById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Todo fetched",
                serviceImplement.getTodoById(id)));
    }

    @Operation(summary = "Update todo (USER / ADMIN)", security = @SecurityRequirement(name = "bearerAuth"))
    @PutMapping("/updatetodo/{todoId}/{userId}")
    public ResponseEntity<ApiResponse<String>> updateTodo(
            @PathVariable Long todoId,
            @Valid @RequestBody TodoModel todoModel,
            @PathVariable Long userId) throws SchedulerException {
        return ResponseEntity.ok(ApiResponse.success("Todo updated",
                serviceImplement.updateTodo(todoId, todoModel, userId)));
    }

    @Operation(summary = "Delete todo — ADMIN ONLY", security = @SecurityRequirement(name = "bearerAuth"))
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleteTodo/{id}")
    public ResponseEntity<ApiResponse<String>> deleteTodo(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Todo deleted",
                serviceImplement.deleteTodo(id)));
    }

    // ── Password Reset ───────────────────────────────────────────────────

    @Operation(summary = "Send OTP for password reset")
    @PostMapping("/forgotpassword/{email}")
    public ResponseEntity<ApiResponse<String>> forgotpasswordOTP(@PathVariable String email) {
        return ResponseEntity.ok(ApiResponse.success("OTP sent",
                serviceImplement.sendSimpleMail(email)));
    }

    @Operation(summary = "Verify OTP")
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<String>> verifyOtp(@RequestBody OTPModel otpModel) {
        return ResponseEntity.ok(ApiResponse.success("OTP verified",
                serviceImplement.validateOTP(otpModel)));
    }

    @Operation(summary = "Reset password")
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(
            @RequestBody ResetPasswordModel resetPasswordModel) {
        return ResponseEntity.ok(ApiResponse.success("Password reset",
                serviceImplement.passwordReset(resetPasswordModel)));
    }
}
