package com.bwsy.todolist.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.bwsy.todolist.dto.friend.FriendRelationDTO;
import com.bwsy.todolist.dto.friend.FriendRequestCreateRequest;
import com.bwsy.todolist.dto.friend.FriendRequestResponse;
import com.bwsy.todolist.dto.friend.FriendResponse;
import com.bwsy.todolist.dto.friend.MemberSearchResponse;
import com.bwsy.todolist.mapper.FriendMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FriendService {

    private final FriendMapper friendMapper;

    // 사용자 검색
    public List<MemberSearchResponse> searchMembers(String keyword, Long loginUserId) {

        // 현재 로그인한 사용자가 유효한 사용자인지 확인
        validateLoginUser(loginUserId);

        // 검색어가 없으면 DB 조회를 하지 않고 빈 리스트 반환
        if (keyword == null || keyword.trim().isEmpty()) {
            return List.of();
        }

        // 검색어 앞뒤 공백을 제거한 뒤 사용자 검색
        return friendMapper.searchMembers(keyword.trim(), loginUserId);
    }

    // 친구 요청 보내기
    @Transactional
    public void sendFriendRequest(Long loginUserId, FriendRequestCreateRequest request) {
        // 현재 로그인한 사용자가 유효한 사용자인지 확인
        validateLoginUser(loginUserId);

        // 친구 요청을 받을 사용자 ID
        Long receiverId = request.getReceiverId();

        // 요청 대상이 없으면 잘못된 요청 처리
        if (receiverId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "친구 요청 대상이 필요합니다.");
        }

        // 자기 자신에게 친구 요청을 보내는 것을 방지
        if (loginUserId.equals(receiverId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "자기 자신에게는 친구 요청을 보낼 수 없습니다.");
        }

        // 친구 요청 대상 사용자가 실제로 존재하고 ACTIVE 상태인지 확인
        validateActiveUser(receiverId);

        // 두 사용자 사이에 기존 친구 관계가 있는지 조회
        FriendRelationDTO relation = friendMapper.findRelationBetweenUsers(loginUserId, receiverId);

        if (relation != null) {
            if ("PENDING".equals(relation.getStatus())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 대기 중인 친구 요청이 있습니다.");
            }

            if ("ACCEPTED".equals(relation.getStatus())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 친구인 사용자입니다.");
            }

            // 과거에 거절되었거나 삭제된 관계를 다시 친구 요청 상태로 변경
            friendMapper.updateExistingRelationToPending(
                    relation.getFriendId(),
                    loginUserId,
                    receiverId
            );
            return;
        }

        // 두 사용자 사이의 기존 관계가 없으면 새 친구 요청 생성
        friendMapper.insertFriendRequest(loginUserId, receiverId);
    }

    // 받은 친구 요청 목록 조회
    public List<FriendRequestResponse> findReceivedRequests(Long loginUserId) {
        validateLoginUser(loginUserId);
        return friendMapper.findReceivedRequests(loginUserId);
    }

    // 친구 요청 수락
    @Transactional
    public void acceptRequest(Long loginUserId, Long requestId) {
        // friendId에 해당하는 친구 요청 또는 친구 관계 조회
        FriendRelationDTO request = findRequestOrThrow(requestId);

        if (!request.getReceiverId().equals(loginUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인에게 온 친구 요청만 수락할 수 있습니다.");
        }

        if (!"PENDING".equals(request.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "대기 중인 친구 요청만 수락할 수 있습니다.");
        }

        // 친구 요청 상태를 ACCEPTED로 변경
        int updatedCount = friendMapper.acceptRequest(requestId);

        if (updatedCount == 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "친구 요청 수락에 실패했습니다.");
        }
    }

    // 친구 요청 거절
    @Transactional
    public void rejectRequest(Long loginUserId, Long requestId) {
        // friendId에 해당하는 친구 요청 또는 친구 관계 조회
        FriendRelationDTO request = findRequestOrThrow(requestId);

        if (!request.getReceiverId().equals(loginUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인에게 온 친구 요청만 거절할 수 있습니다.");
        }

        if (!"PENDING".equals(request.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "대기 중인 친구 요청만 거절할 수 있습니다.");
        }

        // 친구 요청 상태를 REJECTED로 변경
        int updatedCount = friendMapper.rejectRequest(requestId);

        if (updatedCount == 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "친구 요청 거절에 실패했습니다.");
        }
    }

    // 친구 목록 조회
    public List<FriendResponse> findFriends(Long loginUserId) {
        validateLoginUser(loginUserId);
        return friendMapper.findFriends(loginUserId);
    }

    // 친구 삭제
    @Transactional
    public void deleteFriend(Long loginUserId, Long friendId) {
        FriendRelationDTO friend = findRequestOrThrow(friendId);

        // 현재 로그인한 사용자가 해당 친구 관계의 당사자인지 확인
        boolean isRequester = friend.getRequesterId().equals(loginUserId);
        boolean isReceiver = friend.getReceiverId().equals(loginUserId);

        if (!isRequester && !isReceiver) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인의 친구 관계만 삭제할 수 있습니다.");
        }

        if (!"ACCEPTED".equals(friend.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "친구 관계만 삭제할 수 있습니다.");
        }

        // 친구 관계를 DELETED 상태로 변경
        int updatedCount = friendMapper.deleteFriend(friendId);

        if (updatedCount == 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "친구 삭제에 실패했습니다.");
        }
    }

    // 친구 요청 또는 친구 관계 단건 조회
    private FriendRelationDTO findRequestOrThrow(Long friendId) {
        FriendRelationDTO friend = friendMapper.findById(friendId);

        // 조회 결과가 없으면 404 NOT_FOUND 처리
        if (friend == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "친구 요청 또는 친구 관계를 찾을 수 없습니다.");
        }

        return friend;
    }

    // 로그인 사용자 검증
    private void validateLoginUser(Long loginUserId) {
        // 로그인 사용자 ID가 없으면 인증되지 않은 요청으로 처리
        if (loginUserId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        // 사용자 존재 여부와 ACTIVE 상태 확인
        validateActiveUser(loginUserId);
    }

    // 활성 사용자 검증
    private void validateActiveUser(Long userId) {
        // ACTIVE 상태의 사용자 수 조회
        int count = friendMapper.countActiveUserById(userId);
        // 사용자가 없거나 탈퇴한 사용자이면 예외 발생
        if (count == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
        }
    }

}
