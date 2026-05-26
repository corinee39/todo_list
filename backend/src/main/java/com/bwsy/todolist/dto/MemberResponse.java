package com.bwsy.todolist.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MemberResponse {
    private Long userId;
    private String email;
    private String nickname;
    private String provider;
}