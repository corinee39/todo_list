package com.bwsy.todolist.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.bwsy.todolist.dto.TodoCategoryDTO;

@Mapper
public interface TodoCategoryMapper {

    // 특정 사용자의 카테고리 목록 조회
    List<TodoCategoryDTO> findAllByUserId(Long userId);

    // 카테고리ID 와 사용자ID 가 모두 일치하는 카테고리 1개 조회
    TodoCategoryDTO findByIdAndUserId(
        @Param("categoryId") Long categoryId,
        @Param("userId") Long userId
    );

    // 같은 사용자가 동일한 이름의 카테고리를 가지고 있는지 확인
    int countActiveCategoryByName(
        @Param("userId") Long userId,
        @Param("name") String name,
        // 수정할 때 자기 자신은 중복 검사에서 제외하기 위해 사용
        @Param("excludeCategoryId") Long excludeCategoryId
    );

    // 새로운 카테고리를 등록
    int insertCategory(TodoCategoryDTO todoCategoryDTO);

    // 기존 카테고리명 수정
    int updateCategory(
        @Param("categoryId") Long categoryId,
        @Param("userId") Long userId,
        @Param("name") String name
    );

    // 카테고리를 실제로 삭제하지 않고 소프트 삭제 처리
    int softDeleteCategory(
        @Param("categoryId") Long categoryId,
        @Param("userId") Long userId
    );

}
