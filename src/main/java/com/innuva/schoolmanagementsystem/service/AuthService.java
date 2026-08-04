package com.innuva.schoolmanagementsystem.service;

import com.innuva.schoolmanagementsystem.dto.LoginRequest;
import com.innuva.schoolmanagementsystem.dto.LoginResponse;
import com.innuva.schoolmanagementsystem.entity.User;
import com.innuva.schoolmanagementsystem.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository
                .findByUsernameIgnoreCaseAndPassword(
                        request.getUsername().trim(),
                        request.getPassword()
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid username or password"
                        )
                );

        String roleName =
                userRepository.findRoleNameByUserId(user.getId());

        List<String> rights =
                userRepository.findRightNamesByUserId(user.getId());

        return new LoginResponse(
                user.getId(),
                user.getUsername(),
                roleName,
                rights
        );
    }
}