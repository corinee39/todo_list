package com.bwsy.todolist.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.bwsy.todolist.dto.todo.TodoDTO;
import com.bwsy.todolist.mapper.TodoMapper;
import com.bwsy.todolist.validation.TodoCreateRequest;
import com.bwsy.todolist.validation.TodoUpdateRequest;

@Service
public class TodoService {

    @Autowired
    private TodoMapper todoMapper;

    // 특정 사용자의 특정 날짜 할일 목록을 조회
    @Transactional(readOnly = true)
    public List<TodoDTO> findTodos(Long userId, LocalDate todoDate) {
        return todoMapper.findTodosByDate(userId, todoDate);
    }

    // 특정 사용자의 특정 연/월에 할 일이 존재하는 날짜 목록을 조회 (달력 점 표시용)
    @Transactional(readOnly = true)
    public List<LocalDate> findTodoDatesByMonth(Long userId, int year, int month) {
        return todoMapper.findTodoDatesByMonth(userId, year, month);
    }

    // 특정 사용자의 할 일 상세 정보를 조회 - todoId와 userId 함께 사용해서 다른 사용자의 할 일 조회하지 못하도록
    @Transactional(readOnly = true)
    public TodoDTO findTodo(Long userId, Long todoId) {
        TodoDTO todo = todoMapper.findTodoByIdAndUserId(todoId, userId);

        // 조회 결과가 없으면 404 에러 발생
        if (todo == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "할 일을 찾을 수 없습니다.");
        }

        return todo;
    }

    // 새로운 할 일 등록
    @Transactional
    public TodoDTO createTodo(Long userId, TodoCreateRequest request) {
        // 요청한 카테고리가 현재 사용자의 카테고리인지 확인
        // 다른 사용자의 카테고리에 할 일을 등록하지 못하게 검증
        validateCategoryOwner(userId, request.getCategoryId());

        // 요청 데이터를 TodoDTO 객체에 담음
        TodoDTO todo = new TodoDTO();
        todo.setUserId(userId);
        todo.setCategoryId(request.getCategoryId());
        todo.setTitle(request.getTitle());
        todo.setContent(request.getContent());
        todo.setTodoDate(request.getTodoDate());
        todo.setStatus("WAITING"); // 새로 등록하는 할 일은 기본상태가 WAITING
        todo.setPriority(normalizePriority(request.getPriority())); // 우선순위가 비어있으면 MEDIUM으로 기본값 설정

        todoMapper.insertTodo(todo); // DB에 저장

        return findTodo(userId, todo.getTodoId());
    }

    // 기존 할 일을 수정
    @Transactional
    public TodoDTO updateTodo(Long userId, Long todoId, TodoUpdateRequest request) {
        // 수정할 할 일이 존재하는지 확인 & 현재 사용자의 것인지 검증
        findTodo(userId, todoId);
        // 수정하려는 카테고리가 현재 사용자의 카테고리인지 확인
        validateCategoryOwner(userId, request.getCategoryId());

        // 수정할 데이터를 TodoDTO 객체에 담음
        TodoDTO todo = new TodoDTO();
        todo.setTodoId(todoId);
        todo.setUserId(userId);
        todo.setCategoryId(request.getCategoryId());
        todo.setTitle(request.getTitle());
        todo.setContent(request.getContent());
        todo.setTodoDate(request.getTodoDate());
        todo.setStatus(request.getStatus());
        todo.setPriority(request.getPriority());

        // DB에 할 일 정보 수정 & 수정된 행의 개수 반환
        int updatedCount = todoMapper.updateTodo(todo);

        // 수정된 행이 0개이면 수정할 데이터가 없다는 뜻이므로 404 에러 발생
        if (updatedCount == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "수정할 할 일을 찾을 수 없습니다.");
        }

        return findTodo(userId, todoId);
    }

    // 할 일 삭제 - 소프트 삭제
    @Transactional
    public void deleteTodo(Long userId, Long todoId) {
        findTodo(userId, todoId);

        int deletedCount = todoMapper.softDeleteTodo(todoId, userId);

        if (deletedCount == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "삭제할 할 일을 찾을 수 없습니다.");
        }
    }

    // 현재 로그인한 사용자의 활성 카테고리인지 확인
    private void validateCategoryOwner(Long userId, Long categoryId) {
        int count = todoMapper.existsActiveCategoryByIdAndUserId(categoryId, userId);

        // count가 0이면 해당 사용자가 사용할 수 없는 카테고리임
        if (count == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "사용할 수 없는 카테고리입니다.");
        }
    }

    // 우선순위 기본값을 처리하는 메서드
    private String normalizePriority(String priority) {
        // priority 값이 null이거나 빈 문자열이면 MEDIUM을 기본값으로 사용
        if (priority == null || priority.isBlank()) {
            return "MEDIUM";
        }

        return priority;
    }

}
