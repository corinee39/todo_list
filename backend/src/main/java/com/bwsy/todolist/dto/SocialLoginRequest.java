package com.bwsy.todolist.dto;

import lombok.Data;

@Data
public class SocialLoginRequest {
    // 카카오 인가 code
    private String token;
}