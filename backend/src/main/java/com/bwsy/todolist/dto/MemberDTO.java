package com.bwsy.todolist.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class MemberDTO {
    private Long userId;
    private String email;
    private String nickname;
    private String provider;
    private String providerId;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}