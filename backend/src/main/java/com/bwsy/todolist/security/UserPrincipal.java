package com.bwsy.todolist.security;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Spring Security에서 사용할 로그인 사용자 정보 클래스
 *
 * JWT 인증 필터에서 토큰 검증이 성공하면,
 * users 테이블에서 조회한 사용자 정보를 이 객체에 담고
 * SecurityContext에 저장
 *
 * 이후 컨트롤러에서는
 *
 * @AuthenticationPrincipal UserPrincipal principal
 *
 * 형태로 현재 로그인한 사용자의 정보를 꺼내 쓸 수 있음
 */
@Getter
@AllArgsConstructor
public class UserPrincipal implements UserDetails {

    private Long userId;

    // 사용자 이메일 - Spring Security의 username 역할로 사용
    private String email;

    private String nickname;

    private String provider;

    /**
     * 사용자의 권한 목록 반환
     *
     * 현재 프로젝트는 관리자 권한 없이 일반 회원만 사용하므로
     * 별도의 ROLE을 부여하지 않고 빈 목록을 반환
     *
     * 나중에 관리자 기능을 추가한다면
     * ROLE_USER, ROLE_ADMIN 같은 권한을 여기서 반환할 수 있음
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    /**
     * 사용자 비밀번호 반환
     *
     * 우리 프로젝트는 일반 로그인 없이 카카오 소셜 로그인만 사용하므로
     * 비밀번호가 없음
     *
     * 하지만 Spring Security의 UserDetails 인터페이스를 구현하기 위해
     * 빈 문자열을 반환
     */
    @Override
    public String getPassword() {
        return "";
    }

    /**
     * Spring Security에서 사용자를 식별할 이름 반환
     *
     * 일반 로그인에서는 username이나 loginId를 반환하는 경우가 많지만,
     * 우리 프로젝트에서는 이메일을 사용자 식별 이름으로 사용
     */
    @Override
    public String getUsername() {
        return email;
    }
}