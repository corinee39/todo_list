package com.bwsy.todolist.dto.ai;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AiTodoGenerateResponse {

    private List<String> items;
}