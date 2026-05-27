package com.bwsy.todolist.auth;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bwsy.todolist.dto.AuthResponse;
import com.bwsy.todolist.dto.MemberDTO;
import com.bwsy.todolist.mapper.MemberMapper;
import com.bwsy.todolist.security.JwtProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    // 카카오 API와 통신하는 클래스
    private final KakaoAuthClient kakaoAuthClient;

    // 구글 API와 통신하는 클래스
    private final GoogleAuthClient googleAuthClient;

    // users 테이블 접근을 담당하는 MyBatis Mapper
    private final MemberMapper memberMapper;

    /**
     * 우리 서비스 JWT 생성 및 검증을 담당하는 클래스
     *
     * 로그인 성공 후 accessToken을 발급할 때 사용
     */
    private final JwtProvider jwtProvider;

    
    // 카카오 로그인 처리 메서드
    @Transactional
    public AuthResponse loginWithKakao(String authorizationCode) {
        // 카카오 서버에서 사용자 정보 조회
        SocialUserInfo socialUserInfo =
                kakaoAuthClient.getUserInfoByAuthorizationCode(authorizationCode);
        return loginWithSocialUserInfo(socialUserInfo);
    }

    // 구글 로그인 처리 메서드
    @Transactional
    public AuthResponse loginWithGoogle(String authorizationCode) {
        SocialUserInfo socialUserInfo =
                googleAuthClient.getUserInfoByAuthorizationCode(authorizationCode);

        return loginWithSocialUserInfo(socialUserInfo);
    }

    /**
     * 소셜 로그인 공통 처리 메서드
     *
     * 카카오, 구글 모두 이 메서드를 사용함
     *
     * 처리 흐름:
     * 1. provider + providerId 기준으로 기존 회원 조회
     * 2. 없으면 신규 회원가입
     * 3. 탈퇴 회원이면 로그인 차단
     * 4. 우리 서비스 JWT 발급
     * 5. AuthResponse 반환
     */

    private AuthResponse loginWithSocialUserInfo(SocialUserInfo socialUserInfo) {
        // provider + providerId 기준으로 기존 회원 조회
        MemberDTO member = memberMapper.findByProviderAndProviderId(
                socialUserInfo.provider(),
                socialUserInfo.providerId()
        );

        // 기존 회원이 없으면 신규 회원가입 처리
        if (member == null) {
            validateEmailNotUsedByOtherProvider(socialUserInfo);

            // users 테이블에 저장할 회원 DTO 생성
            MemberDTO newMember = new MemberDTO();
            newMember.setEmail(socialUserInfo.email());
            newMember.setNickname(createUniqueNickname(socialUserInfo.nickname()));
            newMember.setProvider(socialUserInfo.provider());
            newMember.setProviderId(socialUserInfo.providerId());

            // 신규 회원 등록
            memberMapper.insertMember(newMember);

            // insert 후 다시 조회
            member = memberMapper.findByProviderAndProviderId(
                    socialUserInfo.provider(),
                    socialUserInfo.providerId()
            );
        }

        // 탈퇴한 계정이면 로그인 차단
        if ("DELETED".equals(member.getStatus())) {
            throw new IllegalStateException("탈퇴한 계정입니다.");
        }

        // 우리 서비스에서 사용할 JWT 발급
        String accessToken = jwtProvider.createAccessToken(
                member.getUserId(),
                member.getEmail(),
                member.getProvider()
        );

        // React에 로그인 성공 응답 반환
        return new AuthResponse(
                accessToken,
                member.getUserId(),
                member.getEmail(),
                member.getNickname()
        );

    }

    /**
     * 같은 이메일이 다른 소셜 계정으로 이미 가입되어 있는지 검사
     *
     * 현재 users.email이 UNIQUE라서
     * 같은 이메일로 카카오/구글 계정이 각각 가입되면 충돌이 발생할 수 있음
     *
     * 그래서 신규 가입 전에 이메일 기준으로 먼저 조회하고,
     * provider 또는 providerId가 다르면 가입을 막음
     *
     * @param socialUserInfo 카카오에서 조회한 사용자 정보
     */
    private void validateEmailNotUsedByOtherProvider(SocialUserInfo socialUserInfo) {
        // 이메일 기준으로 기존 회원 조회
        MemberDTO memberByEmail = memberMapper.findByEmail(socialUserInfo.email());

        // 같은 이메일을 사용하는 회원이 없으면 가입 가능
        if (memberByEmail == null) {
            return;
        }

        // 기존 회원의 provider와 현재 로그인 provider가 같은지 확인
        boolean sameProvider =
                socialUserInfo.provider().equals(memberByEmail.getProvider());

        // 기존 회원의 providerId와 현재 로그인 providerId가 같은지 확인
        boolean sameProviderId =
                socialUserInfo.providerId().equals(memberByEmail.getProviderId());

        // 같은 이메일이지만 다른 소셜 계정이면 가입 차단
        if (!sameProvider || !sameProviderId) {
            throw new IllegalStateException("이미 다른 소셜 계정으로 가입된 이메일입니다.");
        }
    }

    /**
     * 중복되지 않는 닉네임 생성
     *
     * 카카오 닉네임이 이미 다른 사용자가 사용 중일 수 있으므로,
     * 중복이면 뒤에 숫자를 붙임
     *
     * @param nickname 카카오에서 받은 닉네임
     * @return 중복되지 않는 닉네임
     */
    private String createUniqueNickname(String nickname) {
        // 닉네임 기본 정리
        String baseNickname = normalizeNickname(nickname);
        // 처음에는 원본 닉네임으로 시도
        String candidate = baseNickname;
        // 중복 시 뒤에 붙일 숫자
        int number = 1;

        /*
         * 같은 닉네임이 이미 존재하면
         * baseNickname + 숫자 형태로 새로운 후보를 만듬
         */
        while (memberMapper.countByNickname(candidate) > 0) {
            candidate = baseNickname + number;
            number++;
        }

        return candidate;
    }

    /**
     * 닉네임 정리 메서드
     *
     * 처리 내용:
     * 1. null 또는 빈 문자열이면 기본 닉네임 kakao_user 사용
     * 2. 앞뒤 공백 제거
     * 3. 너무 길면 20자로 자름
     *
     * @param nickname 카카오에서 받은 닉네임
     * @return 정리된 닉네임
     */
    private String normalizeNickname(String nickname) {
        // 카카오 닉네임이 없으면 기본 닉네임 사용
        if (nickname == null || nickname.isBlank()) {
            return "kakao_user";
        }

        // 앞뒤 공백 제거
        String result = nickname.trim();

        // 닉네임이 너무 길면 20자로 제한
        if (result.length() > 20) {
            result = result.substring(0, 20);
        }

        return result;
    }
}