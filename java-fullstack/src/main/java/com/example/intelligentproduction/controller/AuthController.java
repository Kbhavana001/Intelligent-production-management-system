package com.example.intelligentproduction.controller;

import com.example.intelligentproduction.model.User;
import com.example.intelligentproduction.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> signupRequest) {
        try {
            String username = signupRequest.get("username");
            String password = signupRequest.get("password");
            String email = signupRequest.get("email");
            String role = signupRequest.get("role");

            // Validate input
            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Username is required");
            }
            if (password == null || password.length() < 6) {
                return ResponseEntity.badRequest().body("Password must be at least 6 characters");
            }
            if (email == null || !email.contains("@")) {
                return ResponseEntity.badRequest().body("Valid email is required");
            }
            if (role == null || (!role.equals("MANUFACTURER") && !role.equals("VENDOR"))) {
                return ResponseEntity.badRequest().body("Invalid role");
            }

            User user = authService.registerUser(username, password, email, role);
            return ResponseEntity.ok(Map.of(
                "message", "User registered successfully",
                "username", user.getUsername(),
                "role", user.getRole()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
}
