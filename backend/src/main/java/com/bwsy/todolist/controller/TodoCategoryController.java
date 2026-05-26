package com.bwsy.todolist.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bwsy.todolist.dto.TodoCategoryDTO;
import com.bwsy.todolist.security.UserPrincipal;
import com.bwsy.todolist.service.TodoCategoryService;
import com.bwsy.todolist.validation.TodoCategorySaveRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/todo-categories")
public class TodoCategoryController {

    private final TodoCategoryService todoCategoryService;

     // 카테고리 목록 조회 API
    @GetMapping
    public ResponseEntity<List<TodoCategoryDTO>> findCategories(
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long userId = principal.getUserId();
        List<TodoCategoryDTO> categories = todoCategoryService.findCategories(userId);
        // 조회 성공 시 HTTP 200 OK와 함께 카테고리 목록 반환
        return ResponseEntity.ok(categories);
    }

    /** 카테고리 등록 API
     * @RequestBody: JSON 요청 데이터를 TodoCategorySaveRequest 객체로 변환
     * @Valid: TodoCategorySaveRequest에 작성한 validation 검사를 실행
     * 
     * 처리 흐름
     * 1. React에서 카테고리 등록 요청
     * 2. Controller가 요청 Body를 DTO로 받음
     * 3. Service의 createCategory(request) 호출
     * 4. 등록된 카테고리 정보를 응답으로 반환
     */
    @PostMapping
    public ResponseEntity<TodoCategoryDTO> createCategory(
        @AuthenticationPrincipal UserPrincipal principal,
        @Valid @RequestBody TodoCategorySaveRequest request
    ) {
        Long userId = principal.getUserId();
        TodoCategoryDTO category = todoCategoryService.createCategory(userId, request);
        // 등록 성공 시 HTTP 201 Created 반환
        return ResponseEntity.status(HttpStatus.CREATED).body(category);
    }

    /** 카테고리 수정 API
     * @PathVariable: URL 경로에 포함된 categoryId 값을 받음
     * @RequestBody: 수정할 카테고리명을 요청 Body로 받음
     * 
     * 처리 흐름
     * 1. React에서 수정할 categoryId와 수정 데이터를 전달
     * 2. Controller가 categoryId와 request를 받음
     * 3. Service의 updateCategory(categoryId, request) 호출
     * 4. 수정된 카테고리 정보를 응답으로 반환
     */
    @PostMapping("/{categoryId}/update")
    public ResponseEntity<TodoCategoryDTO> updateCategory(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable("categoryId") Long categoryId,
            @Valid @RequestBody TodoCategorySaveRequest request
    ) {
        Long userId = principal.getUserId();
        TodoCategoryDTO category = todoCategoryService.updateCategory(userId, categoryId, request);
        return ResponseEntity.ok(category);
    }

    /** 카테고리 삭제 API
     * 
     * 처리 흐름
     * 1. React에서 삭제할 categoryId와 userId 전달
     * 2. Controller가 categoryId와 request를 받음
     * 3. Service의 deleteCategory(userId, categoryId) 호출
     * 4. 삭제 성공 메시지 반환
     */
    @PostMapping("/{categoryId}/delete")
    public ResponseEntity<Map<String, String>> deleteCategory(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable("categoryId") Long categoryId
    ) {
        Long userId = principal.getUserId();
        todoCategoryService.deleteCategory(userId, categoryId);

        // 삭제 성공 시 간단한 메시지를 JSON 형태로 반환
        return ResponseEntity.ok(
                Map.of("message", "카테고리가 삭제되었습니다.")
        );
    }

}
