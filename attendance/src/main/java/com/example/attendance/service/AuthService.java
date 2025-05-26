package com.example.attendance.service;

import com.example.attendance.dto.LoginRequest;
import com.example.attendance.dto.SignupRequest;
import com.example.attendance.model.User;
import com.example.attendance.repository.UserRepository;
import com.example.attendance.util.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public AuthService(UserRepository userRepository, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public String signup(SignupRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return "이미 존재하는 사용자입니다.";
        }

        User user = User.builder()
                .username(request.getUsername())
                .realname(request.getRealname())
                .password(request.getPassword()) // 나중엔 암호화
                .build();

        userRepository.save(user);
        return "회원가입 성공";
    }

    public String login(LoginRequest request) {
        return userRepository.findByUsername(request.getUsername())
                .filter(user -> user.getPassword().equals(request.getPassword()))
                .map(user -> jwtTokenProvider.generateToken(user.getUsername())) // ✅ JWT 발급
                .orElse(null);
    }
}
