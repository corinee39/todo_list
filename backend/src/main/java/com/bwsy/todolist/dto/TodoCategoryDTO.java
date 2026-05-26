package com.bwsy.todolist.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class TodoCategoryDTO {

    private Long categoryId;
    private Long userId;
    private String name;

    // ACTIVE, DELETED
    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

}
