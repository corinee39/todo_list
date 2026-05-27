package com.bwsy.todolist.dto.friend;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MemberSearchResponse {

    private Long userId;
    private String email;
    private String nickname;

}
