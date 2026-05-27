package com.bwsy.todolist.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class GoogleUserInfoResponse {

    // 구글 회원 고유 ID
    private String sub;

    // 구글 이메일
    private String email;

    // 이메일 인증 여부
    @JsonProperty("email_verified")
    private Boolean emailVerified;

    // 구글 사용자 이름
    private String name;

    // 프로필 이미지 URL
    private String picture;
}