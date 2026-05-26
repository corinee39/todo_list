package com.bwsy.todolist.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bwsy.todolist.dto.TodoDTO;
import com.bwsy.todolist.service.TodoService;
import com.bwsy.todolist.validation.TodoCreateRequest;
import com.bwsy.todolist.validation.TodoUpdateRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService todoService;

    // TODO: 로그인 기능 구현 후 userId는 @AuthenticationPrincipal 또는 JWT 정보에서 가져오도록 변경
    @GetMapping
    public ResponseEntity<List<TodoDTO>> findTodos(
            @RequestParam("userId") Long userId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate todoDate
    ) {
        return ResponseEntity.ok(todoService.findTodos(userId, todoDate));
    }

    @PostMapping
    public ResponseEntity<TodoDTO> createTodo(
            @RequestParam("userId") Long userId,
            @Valid @RequestBody TodoCreateRequest request
    ) {
        TodoDTO createdTodo = todoService.createTodo(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTodo);
    }

    @GetMapping("/{todoId}")
    public ResponseEntity<TodoDTO> findTodo(
            @RequestParam("userId") Long userId,
            @PathVariable("todoId") Long todoId
    ) {
        return ResponseEntity.ok(todoService.findTodo(userId, todoId));
    }

    @PostMapping("/{todoId}/update")
    public ResponseEntity<TodoDTO> updateTodo(
            @RequestParam("userId") Long userId,
            @PathVariable("todoId") Long todoId,
            @Valid @RequestBody TodoUpdateRequest request
    ) {
        return ResponseEntity.ok(todoService.updateTodo(userId, todoId, request));
    }

    @PostMapping("/{todoId}/delete")
    public ResponseEntity<Map<String, String>> deleteTodo(
            @RequestParam("userId") Long userId,
            @PathVariable("todoId") Long todoId
    ) {
        todoService.deleteTodo(userId, todoId);
        return ResponseEntity.ok(Map.of("message", "할 일이 삭제되었습니다."));
    }

}
