package com.bwsy.todolist.dto.friend;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FriendRelationDTO {

    private Long friendId;
    private Long requesterId;
    private Long receiverId;
    private String status;

}
