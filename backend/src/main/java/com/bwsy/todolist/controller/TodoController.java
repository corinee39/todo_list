package com.bwsy.todolist.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bwsy.todolist.dto.todo.TodoDTO;
import com.bwsy.todolist.security.UserPrincipal;
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

    @GetMapping
    public ResponseEntity<List<TodoDTO>> findTodos(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate todoDate
    ) {
        Long userId = principal.getUserId();

        return ResponseEntity.ok(todoService.findTodos(userId, todoDate));
    }

    // 달력 점 표시용: 해당 연/월에 할 일이 존재하는 날짜 목록을 조회
    @GetMapping("/month")
    public ResponseEntity<List<LocalDate>> findTodoDatesByMonth(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam("year") int year,
            @RequestParam("month") int month
    ) {
        Long userId = principal.getUserId();

        return ResponseEntity.ok(todoService.findTodoDatesByMonth(userId, year, month));
    }

    @PostMapping
    public ResponseEntity<TodoDTO> createTodo(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody TodoCreateRequest request
    ) {
        Long userId = principal.getUserId();
        TodoDTO createdTodo = todoService.createTodo(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTodo);
    }

    @GetMapping("/{todoId}")
    public ResponseEntity<TodoDTO> findTodo(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable("todoId") Long todoId
    ) {
        Long userId = principal.getUserId();
        return ResponseEntity.ok(todoService.findTodo(userId, todoId));
    }

    @PostMapping("/{todoId}/update")
    public ResponseEntity<TodoDTO> updateTodo(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable("todoId") Long todoId,
            @Valid @RequestBody TodoUpdateRequest request
    ) {
        Long userId = principal.getUserId();
        return ResponseEntity.ok(todoService.updateTodo(userId, todoId, request));
    }

    @PostMapping("/{todoId}/delete")
    public ResponseEntity<Map<String, String>> deleteTodo(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable("todoId") Long todoId
    ) {
        Long userId = principal.getUserId();
        todoService.deleteTodo(userId, todoId);
        return ResponseEntity.ok(Map.of("message", "할 일이 삭제되었습니다."));
    }

}
