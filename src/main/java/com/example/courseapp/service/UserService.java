package com.example.courseapp.service;

import com.example.courseapp.model.UserModel;
import com.example.courseapp.repository.UserRepository;
import lombok.Getter;
import org.springframework.stereotype.Service;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService{

    private final UserRepository userRepository;
    @Getter
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<UserModel> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public UserModel saveUser(UserModel user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public boolean userExists(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
