package com.bwsy.todolist.dto.friend;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FriendRequestCreateRequest {

    @NotNull(message = "친구 요청 대상 사용자 ID는 필수입니다.")
    private Long receiverId;

}
