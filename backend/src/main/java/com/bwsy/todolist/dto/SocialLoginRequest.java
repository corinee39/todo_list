package com.bwsy.todolist.dto;

import lombok.Data;

@Data
public class SocialLoginRequest {
    // 소셜 로그인 인가 code
    private String token;
}