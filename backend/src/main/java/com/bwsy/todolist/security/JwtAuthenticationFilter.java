package com.bwsy.todolist.security;

import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.bwsy.todolist.dto.MemberDTO;
import com.bwsy.todolist.mapper.MemberMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * JWT 인증 필터
 *
 * 클라이언트가 API 요청을 보낼 때
 * Authorization 헤더에 담아 보낸 JWT를 검사
 *
 * 예:
 * Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
 *
 * JWT가 유효하면 users 테이블에서 사용자를 조회하고,
 * Spring Security의 SecurityContext에 로그인 사용자 정보를 저장
 *
 * 그러면 컨트롤러에서
 *
 * @AuthenticationPrincipal UserPrincipal principal
 *
 * 형태로 현재 로그인 사용자를 꺼내 쓸 수 있음
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // JWT 생성, 검증, userId 추출을 담당하는 클래스
    private final JwtProvider jwtProvider;

    // JWT에서 꺼낸 userId로 실제 사용자가 DB에 존재하는지 확인하기 위한 Mapper
    private final MemberMapper memberMapper;

    /**
     * 요청이 들어올 때마다 실행되는 필터 메서드
     *
     * OncePerRequestFilter를 상속했기 때문에
     * 하나의 요청당 한 번만 실행
     */
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // 요청 헤더에서 JWT 추출
        String token = resolveToken(request);

        // 토큰이 존재하고, 서명/만료시간 검증에 성공한 경우
        if (token != null && jwtProvider.validateToken(token)) {

            // JWT subject에 저장해둔 userId 추출
            Long userId = jwtProvider.getUserId(token);

            // DB에서 ACTIVE 상태의 사용자 조회
            MemberDTO member = memberMapper.findActiveById(userId);

            // 사용자가 실제로 존재하고 ACTIVE 상태인 경우에만 인증 처리
            if (member != null) {

                // Spring Security에 저장할 로그인 사용자 객체 생성
                UserPrincipal principal = new UserPrincipal(
                        member.getUserId(),
                        member.getEmail(),
                        member.getNickname(),
                        member.getProvider()
                );

                /*
                 * Spring Security가 이해할 수 있는 인증 객체 생성
                 *
                 * 첫 번째 인자: 로그인 사용자 정보
                 * 두 번째 인자: 비밀번호 또는 인증 정보
                 * 세 번째 인자: 권한 목록
                 *
                 * 현재 프로젝트는 소셜 로그인만 사용하고,
                 * 별도 권한도 사용하지 않으므로 credentials는 null
                 */
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                principal,
                                null,
                                principal.getAuthorities()
                        );

                /*
                 * SecurityContext에 인증 정보 저장
                 *
                 * 이 코드가 실행되면 Spring Security는
                 * 현재 요청을 "로그인된 사용자 요청"으로 인식
                 */
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        /*
         * 다음 필터로 요청 전달
         *
         * JWT가 없거나 유효하지 않아도 여기서 요청을 막지 않음
         * 실제 접근 허용/차단은 SecurityConfig의
         * .anyRequest().authenticated() 설정이 처리
         */
        filterChain.doFilter(request, response);
    }

    // Authorization 헤더에서 실제 JWT 문자열만 추출하는 메서드

    private String resolveToken(HttpServletRequest request) {

        // Authorization 헤더 값 조회
        String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);

        // 헤더가 없거나 Bearer 방식이 아니면 JWT가 없는 요청으로 판단
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return null;
        }

        // "Bearer " 이후의 JWT 문자열만 잘라서 반환
        return authorization.substring(7);
    }
}