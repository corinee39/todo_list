package com.bwsy.todolist.validation;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TodoCategoryDeleteRequest {

    @NotNull(message = "userId는 필수입니다.")
    private Long userId;

}
