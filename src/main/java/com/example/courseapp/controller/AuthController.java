package com.example.courseapp.controller;

import com.example.courseapp.dto.LoginRequest;
import com.example.courseapp.model.Role;
import com.example.courseapp.model.UserModel;
import com.example.courseapp.security.JwtUtils;
import com.example.courseapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtils jwtUtils;

    @Autowired
    public AuthController(UserService userService, JwtUtils jwtUtils) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserModel user) {
        if (userService.userExists(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username already taken");
        }

        if (user.getRole() == null) {
            user.setRole(Role.USER);   // <-- DEFAULT
        }

        userService.saveUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        return userService.findByUsername(loginRequest.getUsername())
                .map(user -> {
                    boolean passwordMatches = userService.checkPassword(
                            loginRequest.getPassword(),
                            user.getPassword()
                    );
                    if (passwordMatches) {
                        String token = jwtUtils.generateToken(user.getUsername());
                        Map<String, String> response = new HashMap<>();
                        response.put("token", token);
                        response.put("username", user.getUsername());
                        response.put("role", user.getRole().toString());
                        return ResponseEntity.ok(response);
                    } else {
                        return ResponseEntity.status(401).body("Invalid credentials");
                    }
                })
                .orElseGet(() -> ResponseEntity.status(401).body("Invalid credentials"));
    }

}