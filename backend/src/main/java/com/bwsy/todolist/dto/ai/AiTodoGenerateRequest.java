package com.bwsy.todolist.dto.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiTodoGenerateRequest {

    @NotBlank(message = "목표는 필수입니다.")
    private String goal;

    private String period;
}