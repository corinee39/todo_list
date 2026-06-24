package com.bwsy.todolist.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.bwsy.todolist.dto.MemberDTO;

@Mapper
public interface MemberMapper {

    // 소셜 로그인 제공자와 제공자 사용자 ID로 회원 조회
    MemberDTO findByProviderAndProviderId(
            @Param("provider") String provider,
            @Param("providerId") String providerId
    );

    // 이메일로 회원 조회
    MemberDTO findByEmail(String email);

    // 활성 상태의 회원을 userId로 조회
    MemberDTO findActiveById(Long userId);

    // 닉네임 중복 개수 조회
    int countByNickname(String nickname);

    // 본인을 제외한 닉네임 중복 개수 조회 (닉네임 수정 시 사용)
    int countByNicknameAndNotUserId(@Param("nickname") String nickname,
                                    @Param("userId") Long userId);

    // 신규 회원 등록
    void insertMember(MemberDTO member);

    // 닉네임 수정
    int updateNickname(@Param("userId") Long userId,
                       @Param("nickname") String nickname);

    // 회원 탈퇴 (소프트 삭제)
    int softDeleteMember(@Param("userId") Long userId);
}