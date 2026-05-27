package com.bwsy.todolist.dto.todo;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TodoDTO {

    private Long todoId;
    private Long userId;
    private Long categoryId;

    private String title;
    private String content;
    private LocalDate todoDate;

    // WAITING, IN_PROGRESS, DONE
    private String status;

    // HIGH, MEDIUM, LOW
    private String priority;

    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

}
