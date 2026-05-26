package com.bwsy.todolist.controller;

import com.bwsy.todolist.dto.AiTodoGenerateRequest;
import com.bwsy.todolist.dto.AiTodoGenerateResponse;
import com.bwsy.todolist.service.AiTodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiTodoController {

    private final AiTodoService aiTodoService;

    @PostMapping(value = "/todos", produces = "application/json; charset=UTF-8")
    public ResponseEntity<AiTodoGenerateResponse> generateTodos(
            @Valid @RequestBody AiTodoGenerateRequest request
    ) {
        AiTodoGenerateResponse response = aiTodoService.generateTodos(request);
        return ResponseEntity.ok(response);
    }
}