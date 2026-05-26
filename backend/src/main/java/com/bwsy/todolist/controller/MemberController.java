package com.bwsy.todolist.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bwsy.todolist.dto.MemberDTO;
import com.bwsy.todolist.dto.MemberResponse;
import com.bwsy.todolist.mapper.MemberMapper;
import com.bwsy.todolist.security.UserPrincipal;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MemberController {

    private final MemberMapper memberMapper;

    /**
     * 내 정보 조회 API
     *
     * 요청 예:
     * GET /api/members/me
     * Authorization: Bearer 우리_서비스_JWT
     *
     * JWT 인증 흐름:
     * 1. JwtAuthenticationFilter가 Authorization 헤더의 JWT 검증
     * 2. JWT에서 userId 추출
     * 3. users 테이블에서 ACTIVE 사용자 조회
     * 4. UserPrincipal 객체를 SecurityContext에 저장
     * 5. 이 메서드에서 @AuthenticationPrincipal로 UserPrincipal을 받음
     *
     * @param principal 현재 로그인한 사용자 정보
     * @return React에 내려줄 내 정보 응답
     */
    @GetMapping("/api/members/me")
    public MemberResponse getMyInfo(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        /*
         * principal.getUserId()
         * → JWT에서 추출된 현재 로그인 사용자의 userId
         *
         * 프런트에서 userId를 보내는 것이 아니라,
         * 백엔드가 JWT를 통해 신뢰할 수 있는 userId를 직접 사용
         */
        MemberDTO member = memberMapper.findActiveById(principal.getUserId());

        /*
         * MemberDTO를 그대로 반환하지 않고 MemberResponse로 변환
         *
         * 이유:
         * MemberDTO에는 providerId, status, createdAt, deletedAt 같은
         * 내부 관리용 필드가 포함될 수 있음
         *
         * 프런트에는 필요한 정보만 내려주는 것이 좋음
         */
        return new MemberResponse(
                member.getUserId(),
                member.getEmail(),
                member.getNickname(),
                member.getProvider()
        );
    }
}