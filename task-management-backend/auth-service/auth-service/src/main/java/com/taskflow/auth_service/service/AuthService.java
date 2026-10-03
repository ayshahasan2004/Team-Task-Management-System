package com.taskflow.auth_service.service;

import com.taskflow.auth_service.dto.AuthResponse;
import com.taskflow.auth_service.dto.LoginRequest;
import com.taskflow.auth_service.dto.SignupRequest;
import com.taskflow.auth_service.model.User;
import com.taskflow.auth_service.repository.UserRepository;
import com.taskflow.auth_service.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;

  public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtil = jwtUtil;
  }

  public AuthResponse signup(SignupRequest request) {
    String normalizedEmail = request.getEmail().trim().toLowerCase();

    if (userRepository.existsByEmail(normalizedEmail)) {
      throw new IllegalArgumentException("Email already registered");
    }

    User user = new User(
      request.getFullName(),
      normalizedEmail,
      passwordEncoder.encode(request.getPassword())
    );

    User saved = userRepository.save(user);
    String token = jwtUtil.generateToken(saved.getId(), saved.getEmail());

    return new AuthResponse(token, saved.getId(), saved.getFullName(), saved.getEmail());
  }

  public AuthResponse login(LoginRequest request) {
    String normalizedEmail = request.getEmail().trim().toLowerCase();

    User user = userRepository.findByEmail(normalizedEmail)
      .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
      throw new IllegalArgumentException("Invalid email or password");
    }

    String token = jwtUtil.generateToken(user.getId(), user.getEmail());
    return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail());
  }
}
