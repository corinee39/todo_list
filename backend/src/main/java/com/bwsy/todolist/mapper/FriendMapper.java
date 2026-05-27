package com.bwsy.todolist.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.bwsy.todolist.dto.friend.FriendRelationDTO;
import com.bwsy.todolist.dto.friend.FriendRequestResponse;
import com.bwsy.todolist.dto.friend.FriendResponse;
import com.bwsy.todolist.dto.friend.MemberSearchResponse;

@Mapper
public interface FriendMapper {

    /*
     * 사용자 검색
     *
     * 친구 요청을 보내기 전에 이메일 또는 닉네임으로 사용자를 검색
     *
     * keyword     : 검색어
     * loginUserId : 현재 로그인한 사용자 ID
     *
     * loginUserId를 받는 이유
     * - 자기 자신은 검색 결과에서 제외하기 위해
     */
    List<MemberSearchResponse> searchMembers(
        @Param("keyword") String keyword,
        @Param("loginUserId") Long loginUserId
    );

    /*
     * 활성 상태의 사용자 존재 여부 확인
     *
     * 친구 요청 대상 사용자가 실제로 존재하고,
     * 탈퇴하지 않은 ACTIVE 상태인지 확인할 때 사용
     *
     * userId : 확인할 사용자 ID
     *
     * 반환값
     * - 1 이상: 존재하는 활성 사용자
     * - 0: 존재하지 않거나 삭제된 사용자
     */
    int countActiveUserById(@Param("userId") Long userId);

    /*
     * 두 사용자 사이의 친구 관계 조회
     *
     * 친구 요청을 보내기 전에 이미 친구인지,
     * 이미 요청 중인지, 과거에 거절/삭제된 관계가 있는지 확인
     *
     * userId       : 현재 로그인한 사용자 ID
     * targetUserId : 친구 요청 대상 사용자 ID
     *
     * 방향과 관계없이 조회해야 하므로
     * A -> B, B -> A 관계를 모두 확인하는 SQL과 연결
     */
    FriendRelationDTO findRelationBetweenUsers(
        @Param("userId") Long userId,
        @Param("targetUserId") Long targetUserId
    );

    /*
     * 친구 요청 등록
     *
     * 현재 로그인한 사용자가 다른 사용자에게 친구 요청을 보낼 때 사용
     *
     * requesterId : 친구 요청을 보낸 사용자 ID
     * receiverId  : 친구 요청을 받은 사용자 ID
     *
     * friends 테이블에 status = 'PENDING' 상태로 저장
     */
    void insertFriendRequest(
        @Param("requesterId") Long requesterId,
        @Param("receiverId") Long receiverId
    );

    /*
     * 기존 친구 관계를 다시 PENDING 상태로 변경
     *
     * 이전에 거절(REJECTED)되었거나 삭제(DELETED)된 관계가 있을 때
     * 새로운 row를 만들지 않고 기존 row를 재사용해서 다시 친구 요청 상태로 바꿈
     *
     * friendId    : 기존 friends 테이블의 PK
     * requesterId : 새로 친구 요청을 보낸 사용자 ID
     * receiverId  : 새로 친구 요청을 받은 사용자 ID
     *
     * 반환값
     * - 수정된 행의 개수
     */
    int updateExistingRelationToPending(
        @Param("friendId") Long friendId,
        @Param("requesterId") Long requesterId,
        @Param("receiverId") Long receiverId
    );

    /*
     * 받은 친구 요청 목록 조회
     *
     * 현재 로그인한 사용자가 받은 친구 요청 중
     * 아직 수락/거절하지 않은 PENDING 요청 목록을 조회
     *
     * receiverId : 현재 로그인한 사용자 ID
     */
    List<FriendRequestResponse> findReceivedRequests(
        @Param("receiverId") Long receiverId
    );

    /*
     * 친구 요청 또는 친구 관계 단건 조회
     *
     * 요청 수락, 요청 거절, 친구 삭제를 하기 전에
     * 해당 friendId가 실제로 존재하는지 확인할 때 사용
     *
     * friendId : friends 테이블의 PK
     */
    FriendRelationDTO findById(@Param("friendId") Long friendId);

    // 친구 요청 수락
    int acceptRequest(@Param("friendId") Long friendId);

    // 친구 요청 거절
    int rejectRequest(@Param("friendId") Long friendId);

    /*
     * 친구 목록 조회
     *
     * 현재 로그인한 사용자의 친구 목록을 조회
     *
     * loginUserId : 현재 로그인한 사용자 ID
     *
     * friends 테이블에서 status = 'ACCEPTED'인 관계만 조회
     * requester_id 또는 receiver_id 중 하나가 현재 사용자 ID인 데이터를 찾고,
     * 상대방 사용자 정보를 친구 목록으로 반환
     */
    List<FriendResponse> findFriends(@Param("loginUserId") Long loginUserId);

    /*
     * 친구 삭제
     *
     * 실제 DB row를 삭제하지 않고,
     * status를 DELETED로 변경하는 소프트 삭제 방식
     *
     * friendId : 삭제할 친구 관계 ID
     *
     * 반환값
     * - 수정된 행의 개수
     */
    int deleteFriend(@Param("friendId") Long friendId);

}
