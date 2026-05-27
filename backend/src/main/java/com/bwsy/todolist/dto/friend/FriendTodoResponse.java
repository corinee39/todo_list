package com.bwsy.todolist.dto.friend;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FriendTodoResponse {

    private Long todoId;

    private Long categoryId;

    private String categoryName;

    private String title;

    private LocalDate todoDate;

    private String status;

    private String priority;

    private LocalDateTime completedAt;
}