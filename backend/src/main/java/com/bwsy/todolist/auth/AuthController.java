package com.bwsy.todolist.auth;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bwsy.todolist.dto.AuthResponse;
import com.bwsy.todolist.dto.SocialLoginRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/kakao")
    public AuthResponse loginWithKakao(
            @RequestBody SocialLoginRequest request
    ) {
        // return authService.loginWithKakao(request.getToken());

        log.info("카카오 로그인 요청 토큰: {}", request.getToken());
        AuthResponse response = authService.loginWithKakao(request.getToken());
        log.info("우리 서비스 JWT accessToken: {}", response.getAccessToken());

        return response;
        
    }

    @PostMapping("/google")
    public AuthResponse loginWithGoogle(
            @RequestBody SocialLoginRequest request
    ) {
        return authService.loginWithGoogle(request.getToken());
    }
}