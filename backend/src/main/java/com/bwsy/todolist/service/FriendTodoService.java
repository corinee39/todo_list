package com.bwsy.todolist.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.bwsy.todolist.dto.friend.FriendRelationDTO;
import com.bwsy.todolist.dto.friend.FriendTodoDetailResponse;
import com.bwsy.todolist.dto.friend.FriendTodoResponse;
import com.bwsy.todolist.mapper.FriendMapper;
import com.bwsy.todolist.mapper.FriendTodoMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FriendTodoService {

    private final FriendMapper friendMapper;
    private final FriendTodoMapper friendTodoMapper;

    /*
     * 친구의 특정 날짜 할 일 목록 조회
     *
     * loginUserId : JWT에서 꺼낸 현재 로그인 사용자 ID
     * friendId    : friends 테이블의 friend_id
     * date        : 조회할 날짜
     */
    public List<FriendTodoResponse> findFriendTodos(
            Long loginUserId,
            Long friendId,
            LocalDate date
    ) {
        if (date == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "조회 날짜는 필수입니다.");
        }

        /*
         * friendId로 친구 관계를 검증하고,
         * 실제 친구 사용자의 user_id를 구한다.
         */
        Long friendUserId = getFriendUserIdOrThrow(loginUserId, friendId);

        return friendTodoMapper.findFriendTodosByDate(friendUserId, date);
    }

    /*
     * 친구의 특정 연/월에 할 일이 존재하는 날짜 목록 조회 (달력 점 표시용)
     */
    public List<LocalDate> findFriendTodoDates(
            Long loginUserId,
            Long friendId,
            int year,
            int month
    ) {
        Long friendUserId = getFriendUserIdOrThrow(loginUserId, friendId);

        return friendTodoMapper.findFriendTodoDatesByMonth(friendUserId, year, month);
    }

    /*
     * 친구 할 일 상세 조회
     *
     * loginUserId : JWT에서 꺼낸 현재 로그인 사용자 ID
     * friendId    : friends 테이블의 friend_id
     * todoId      : 상세 조회할 할 일 ID
     */
    public FriendTodoDetailResponse findFriendTodoDetail(
            Long loginUserId,
            Long friendId,
            Long todoId
    ) {
        Long friendUserId = getFriendUserIdOrThrow(loginUserId, friendId);

        FriendTodoDetailResponse todo = friendTodoMapper.findFriendTodoDetail(
                friendUserId,
                todoId
        );

        if (todo == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "친구의 할 일을 찾을 수 없습니다.");
        }

        return todo;
    }

    /*
     * 친구 관계 검증 후 실제 친구 사용자 ID 반환
     *
     * 예시 1:
     * requester_id = 현재 사용자
     * receiver_id  = 친구
     * → receiver_id 반환
     *
     * 예시 2:
     * requester_id = 친구
     * receiver_id  = 현재 사용자
     * → requester_id 반환
     */
    private Long getFriendUserIdOrThrow(Long loginUserId, Long friendId) {
        if (loginUserId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        FriendRelationDTO relation = friendMapper.findById(friendId);

        if (relation == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "친구 관계를 찾을 수 없습니다.");
        }

        if (!"ACCEPTED".equals(relation.getStatus())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "친구 관계가 아닙니다.");
        }

        boolean isRequester = relation.getRequesterId().equals(loginUserId);
        boolean isReceiver = relation.getReceiverId().equals(loginUserId);

        if (!isRequester && !isReceiver) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "해당 친구 관계에 접근할 수 없습니다.");
        }

        if (isRequester) {
            return relation.getReceiverId();
        }

        return relation.getRequesterId();
    }
}