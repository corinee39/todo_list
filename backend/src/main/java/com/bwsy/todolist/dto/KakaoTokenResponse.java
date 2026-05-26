package com.bwsy.todolist.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class KakaoTokenResponse {

    // 카카오 응답의 access_token 값을 Java 필드 accessToken에 매핑
    @JsonProperty("access_token")
    private String accessToken;
}