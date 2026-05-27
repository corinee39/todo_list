package com.bwsy.todolist.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.bwsy.todolist.dto.todo.TodoDTO;

@Mapper
public interface TodoMapper {

    // 날짜별 조회
    List<TodoDTO> findTodosByDate(@Param("userId") Long userId,
                                  @Param("todoDate") LocalDate todoDate);

    TodoDTO findTodoByIdAndUserId(@Param("todoId") Long todoId,
                                  @Param("userId") Long userId);

    int insertTodo(TodoDTO todo);

    int updateTodo(TodoDTO todo);

    int softDeleteTodo(@Param("todoId") Long todoId,
                   @Param("userId") Long userId);
    
    // 카테고리로 조회
    int existsActiveCategoryByIdAndUserId(@Param("categoryId") Long categoryId,
                                          @Param("userId") Long userId);

}
