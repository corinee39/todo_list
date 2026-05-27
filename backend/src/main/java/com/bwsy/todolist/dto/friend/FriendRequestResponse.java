package com.bwsy.todolist.dto.friend;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FriendRequestResponse {

    private Long requestId;
    private Long requesterId;
    private String requesterEmail;
    private String requesterNickname;
    private LocalDateTime requestedAt;

}
