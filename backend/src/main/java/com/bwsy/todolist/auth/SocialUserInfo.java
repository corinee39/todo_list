package com.bwsy.todolist.auth;

// 카카오에서 받아온 사용자 정보를 서비스 내부에서 통일해서 쓰기 위함
public record SocialUserInfo(
        String provider,
        String providerId,
        String email,
        String nickname
) {
}