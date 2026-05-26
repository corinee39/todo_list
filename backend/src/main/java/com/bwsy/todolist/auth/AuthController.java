package com.bwsy.todolist.auth;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bwsy.todolist.dto.AuthResponse;
import com.bwsy.todolist.dto.SocialLoginRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/kakao")
    public AuthResponse loginWithKakao(
            @RequestBody SocialLoginRequest request
    ) {
        return authService.loginWithKakao(request.getToken());
    }
}