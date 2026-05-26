package com.bwsy.todolist.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bwsy.todolist.dto.TodoCategoryDTO;
import com.bwsy.todolist.mapper.TodoCategoryMapper;
import com.bwsy.todolist.validation.TodoCategoryDeleteRequest;
import com.bwsy.todolist.validation.TodoCategorySaveRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TodoCategoryService {

    private final TodoCategoryMapper todoCategoryMapper;

    // 특정 사용자의 카테고리 목록을 조회
    public List<TodoCategoryDTO> findCategories(Long userId) {
        validateUserId(userId);
        return todoCategoryMapper.findAllByUserId(userId);
    }

    // 카테고리 등록 메서드
    @Transactional
    public TodoCategoryDTO createCategory(TodoCategorySaveRequest request) {
        // 1. userId 검증
        validateUserId(request.getUserId()); 
        // 2. 카테고리명 앞뒤 공백 제거
        String name = normalizeName(request.getName()); 
        // 3. 카테고리명 필수값, 길이 검증
        validateName(name); 
        // 4. 같은 사용자가 동일한 카테고리명을 이미 사용중인지 검사
        validateDuplicatedName(request.getUserId(), name, null);  

        // 5. DB에 저장할 DTO 객체 생성
        TodoCategoryDTO todoCategoryDTO = new TodoCategoryDTO();
        todoCategoryDTO.setUserId(request.getUserId());
        todoCategoryDTO.setName(name);

        // 6. Mapper를 통해 DB에 insert
        todoCategoryMapper.insertCategory(todoCategoryDTO);

        // 7. 등록된 카테고리를 다시 조회해서 반환
        return todoCategoryMapper.findByIdAndUserId(
            todoCategoryDTO.getCategoryId(),
            request.getUserId()
        );
    }

    // 카테고리 수정 메서드
    @Transactional
    public TodoCategoryDTO updateCategory(Long categoryId, TodoCategorySaveRequest request) {
        // 1. categoryId 검증
        validateCategoryId(categoryId);
        // 2. userId 검증
        validateUserId(request.getUserId());
        // 3. 카테고리명 공백 제거
        String name = normalizeName(request.getName());
        // 4. 카테고리명 유효성 검증
        validateName(name);

        // 5. 해당 카테고리가 존재하고 현재 사용자의 카테고리인지 확인
        TodoCategoryDTO category = todoCategoryMapper.findByIdAndUserId(
            categoryId,
            request.getUserId()
        );

        if (category == null) {
            throw new IllegalArgumentException("카테고리를 찾을 수 없거나 수정 권한이 없습니다.");
        }

        // 6. 카테고리명 중복 검사
        validateDuplicatedName(request.getUserId(), name, categoryId);
        
        // 7. Mapper 통해서 UPDATE
        int result = todoCategoryMapper.updateCategory(
            categoryId, 
            request.getUserId(), 
            name
        );
        // update 결과가 0이면 실제 수정된 행이 없다는 뜻
        if (result == 0) {
            throw new IllegalArgumentException("카테고리 수정에 실패했습니다.");
        }

        // 8. 수정된 카테고리를 다시 조회해서 반환
        return todoCategoryMapper.findByIdAndUserId(
            categoryId, 
            request.getUserId()
        );
    }

    // 카테고리 삭제 메서드
    @Transactional
    public void deleteCategory(Long categoryId, TodoCategoryDeleteRequest request) {
        // 1. categoryId 검증
        validateCategoryId(categoryId);
        // 2. userId 검증
        validateUserId(categoryId);

        // 3. 삭제하려는 카테고리가 현재 사용자의 카테고리인지 확인
        TodoCategoryDTO category = todoCategoryMapper.findByIdAndUserId(
            categoryId, 
            request.getUserId()
        );

        if (category == null) {
            throw new IllegalArgumentException("카테고리를 찾을 수 없거나 삭제 권한이 없습니다.");
        }

        // 4. Mapper를 통해 status, deleted_at 수정
        int result = todoCategoryMapper.softDeleteCategory(
            categoryId, 
            request.getUserId()
        );

        if (result == 0) {
            throw new IllegalArgumentException("카테고리 삭제에 실패했습니다.");
        }
    }

    /** 카테고리 중복 여부 검사
     * 
     * @param userId 사용자별 카테고리명이 중복되지 않도록 하기 위한 값
     * @param name 검사할 카테고리명
     * @param excludeCategoryId 수정 시 자기 자신은 중복 검사에서 제외 / 등록 시에는 null
     * count가 1 이상이면 이미 같은 이름의 카테고리가 있다는 뜻
     */
    private void validateDuplicatedName(Long userId, String name, Long excludeCategoryId) {
        int count = todoCategoryMapper.countActiveCategoryByName(
            userId, 
            name, 
            excludeCategoryId
        );
        if (count > 0) {
            throw new IllegalArgumentException("이미 사용중인 카테고리명입니다.");
        }
    }

    // userId 검증 메서드
    private void validateUserId(Long userId) {
        // userId가 null이면 어떤 사용자의 카테고리인지 알 수 없으므로 예외처리
        if (userId == null) {
            throw new IllegalArgumentException("userId는 필수입니다.");
        }
    }

    // categoryId 검증 메서드
    private void validateCategoryId(Long categoryId) {
        // 수정, 삭제 시 어떤 카테고리를 대상으로 하는지 알아야하므로 categoryId가 null이면 예외처리
        if (categoryId == null) {
            throw new IllegalArgumentException("categoryId는 필수입니다.");
        }
    }

    /** 카테고리명 검증 메서드
     * 
     * 검사 내용
     * 1. null이면 안됨
     * 2. 빈 문자열이면 안됨
     * 3. 공백만 있는 문자열이면 안됨
     * 4. 50자를 초과하면 안됨
     */
    private void validateName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("카테고리명은 필수입니다.");
        }
        if (name.length() > 50) {
            throw new IllegalArgumentException("카테고리명은 50자 이하로 입력해야합니다.");
        }
    }

    // 카테고리명 앞뒤 공백을 제거하는 메서드
    private String normalizeName(String name) {
        // name이 null인 경우 trim() 호출하면 NullPointerException 발생하므로 null을 그대로 반환
        if (name == null) {
            return null;
        }
        return name.trim();
    }

}
