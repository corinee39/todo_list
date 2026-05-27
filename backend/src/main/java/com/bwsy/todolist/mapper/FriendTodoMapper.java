package com.bwsy.todolist.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.bwsy.todolist.dto.friend.FriendTodoDetailResponse;
import com.bwsy.todolist.dto.friend.FriendTodoResponse;

@Mapper
public interface FriendTodoMapper {

    /*
     * 친구의 특정 날짜 할 일 목록 조회
     *
     * friendUserId : 실제 친구 사용자의 user_id
     * date         : 조회할 날짜
     */
    List<FriendTodoResponse> findFriendTodosByDate(
            @Param("friendUserId") Long friendUserId,
            @Param("date") LocalDate date
    );

    /*
     * 친구의 할 일 상세 조회
     *
     * friendUserId : 실제 친구 사용자의 user_id
     * todoId       : 조회할 할 일 ID
     *
     * friendUserId 조건을 함께 거는 이유:
     * - todoId만으로 조회하면 다른 사람의 할 일도 조회될 수 있음
     * - 반드시 해당 친구가 작성한 todo인지 검증해야 함
     */
    FriendTodoDetailResponse findFriendTodoDetail(
            @Param("friendUserId") Long friendUserId,
            @Param("todoId") Long todoId
    );
}
