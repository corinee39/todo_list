package com.bwsy.todolist.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class GoogleTokenResponse {

    // 구글 응답의 access_token 값을 Java 필드 accessToken에 매핑
    @JsonProperty("access_token")
    private String accessToken;

    // 구글 응답의 expires_in 값을 Java 필드 expiresIn에 매핑
    @JsonProperty("expires_in")
    private Integer expiresIn;

    // 구글 응답의 token_type 값을 Java 필드 tokenType에 매핑
    @JsonProperty("token_type")
    private String tokenType;

    // 구글 응답의 scope 값
    private String scope;

    // 구글 OpenID Connect 응답의 id_token 값
    @JsonProperty("id_token")
    private String idToken;
}