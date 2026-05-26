package com.bwsy.todolist.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import com.bwsy.todolist.dto.KakaoTokenResponse;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.RequiredArgsConstructor;

/**
 * 카카오 로그인 API와 통신하는 클래스
 *
 * 역할:
 * 1. React에서 받은 카카오 인가 code로 카카오 access_token 요청
 * 2. 발급받은 카카오 access_token으로 카카오 사용자 정보 조회
 * 3. 조회한 사용자 정보를 SocialUserInfo 객체로 변환해서 AuthService에 반환
 */
@Component
@RequiredArgsConstructor
public class KakaoAuthClient {

    /**
     * 카카오 access_token 발급 URL
     *
     * React에서 받은 인가 code를 이 URL로 보내면
     * 카카오 access_token을 받을 수 있음
     */
    private static final String KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";
    /**
     * 카카오 사용자 정보 조회 URL
     *
     * access_token을 Authorization 헤더에 담아 요청하면
     * 카카오 사용자의 id, email, nickname 등을 받을 수 있음
     */
    private static final String KAKAO_USER_INFO_URL = "https://kapi.kakao.com/v2/user/me";
    /**
     * 외부 API 요청을 보내기 위한 객체
     *
     * SecurityConfig 또는 별도 설정 클래스에서
     * @Bean으로 등록한 RestTemplate이 주입됨
     */
    private final RestTemplate restTemplate;

    @Value("${oauth.kakao.client-id}")
    private String kakaoClientId;

    @Value("${oauth.kakao.redirect-uri}")
    private String kakaoRedirectUri;

    @Value("${oauth.kakao.client-secret:}")
    private String kakaoClientSecret;

    /**
     * 카카오 인가 code로 최종 카카오 사용자 정보를 조회하는 메서드
     *
     * AuthService에서 이 메서드를 호출
     *
     * 흐름:
     * 1. authorizationCode로 카카오 access_token 발급
     * 2. access_token으로 카카오 사용자 정보 조회
     * 3. SocialUserInfo 반환
     *
     * @param authorizationCode React에서 전달받은 카카오 인가 code
     * @return 카카오 사용자 정보
     */
    public SocialUserInfo getUserInfoByAuthorizationCode(String authorizationCode) {
        String kakaoAccessToken = requestAccessToken(authorizationCode);
        return requestUserInfo(kakaoAccessToken);
    }

    // 카카오 인가 code로 카카오 access_token을 발급받는 메서드
    private String requestAccessToken(String authorizationCode) {
        // 인가 code가 없으면 카카오에 토큰 요청을 할 수 없으므로 예외 처리
        if (authorizationCode == null || authorizationCode.isBlank()) {
            throw new IllegalArgumentException("카카오 인가 코드가 없습니다.");
        }

        // 카카오 토큰 요청은 application/x-www-form-urlencoded 형식으로 보내야 함
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // 카카오 토큰 요청에 필요한 파라미터들을 담음
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", kakaoClientId);
        params.add("redirect_uri", kakaoRedirectUri);
        params.add("code", authorizationCode);

        // Client Secret을 사용하는 경우에만 요청 파라미터에 추가
        if (kakaoClientSecret != null && !kakaoClientSecret.isBlank()) {
            params.add("client_secret", kakaoClientSecret);
        }

        // 요청 body와 header를 하나의 HttpEntity로 묶음
        HttpEntity<MultiValueMap<String, String>> request =
                new HttpEntity<>(params, headers);

        try {
            // 카카오 토큰 발급 API 호출
            ResponseEntity<KakaoTokenResponse> response =
                    restTemplate.postForEntity(
                            KAKAO_TOKEN_URL,
                            request,
                            KakaoTokenResponse.class
                    );

            // 응답 body 추출
            KakaoTokenResponse body = response.getBody();

            // access_token이 없으면 카카오 사용자 정보 조회를 진행할 수 없음
            if (body == null || body.getAccessToken() == null) {
                throw new IllegalArgumentException("카카오 access token 발급에 실패했습니다.");
            }
            // 이후 사용자 정보 조회에 사용할 카카오 access_token 반환
            return body.getAccessToken();

        } catch (RestClientException e) {
            throw new IllegalArgumentException("카카오 access token 요청에 실패했습니다.");
        }
    }

    // 카카오 access_token으로 카카오 사용자 정보를 조회하는 메서드
    private SocialUserInfo requestUserInfo(String kakaoAccessToken) {
        // Authorization 헤더에 카카오 access_token을 Bearer 방식으로 담음
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(kakaoAccessToken);

        // GET 요청이므로 body는 필요 없고, header만 담음
        HttpEntity<Void> request = new HttpEntity<>(headers);

        try {
            /*
             * 카카오 사용자 정보 조회 API 호출
             *
             * JsonNode로 받는 이유:
             * 카카오 응답은 kakao_account, profile처럼 중첩된 JSON 구조라서
             * 필요한 값만 path()로 꺼내 쓰기 편함
             */
            ResponseEntity<JsonNode> response =
                    restTemplate.exchange(
                            KAKAO_USER_INFO_URL,
                            HttpMethod.GET,
                            request,
                            JsonNode.class
                    );

            JsonNode body = response.getBody();

            // 응답 body가 없으면 사용자 정보를 조회할 수 없음
            if (body == null) {
                throw new IllegalArgumentException("카카오 사용자 정보 조회에 실패했습니다.");
            }

            /*
             * 카카오 사용자 고유 ID
             *
             * users.provider_id에 저장할 값
             * 우리 서비스에서는 provider = KAKAO, provider_id = 카카오 id 조합으로
             * 사용자를 식별함
             */
            String providerId = body.path("id").asText();

            // kakao_account 안에는 이메일, 프로필 등의 계정 정보가 들어 있음
            JsonNode kakaoAccount = body.path("kakao_account");
            // 카카오 계정 이메일
            String email = kakaoAccount.path("email").asText(null);

            // 카카오 프로필 정보
            JsonNode profile = kakaoAccount.path("profile");
            // 카카오 프로필 닉네임
            String nickname = profile.path("nickname").asText(null);

            /*
             * kakao_account.profile.nickname이 없는 경우
             * properties.nickname에서 한 번 더 닉네임을 찾음
             *
             * 그래도 없으면 기본값 kakao_user를 사용
             */
            if (nickname == null || nickname.isBlank()) {
                nickname = body.path("properties").path("nickname").asText("kakao_user");
            }

            // providerId가 없으면 사용자를 고유하게 식별할 수 없음
            if (providerId == null || providerId.isBlank()) {
                throw new IllegalArgumentException("카카오 사용자 고유 ID가 없습니다.");
            }

            /*
             * 현재 users.email 컬럼이 NOT NULL이므로 이메일이 필요함
             *
             * 이메일이 null이면 카카오 Developers의 동의항목에서
             * 이메일 제공 동의가 설정되어 있는지 확인해야 함
             */
            if (email == null || email.isBlank()) {
                throw new IllegalArgumentException("카카오 이메일 제공 동의가 필요합니다.");
            }
            /*
             * 카카오 사용자 정보를 우리 서비스 내부에서 사용할 객체로 변환
             *
             * 이후 AuthService에서 이 정보를 사용해
             * users 테이블 조회, 회원가입, JWT 발급을 처리
             */
            return new SocialUserInfo(
                    "KAKAO",
                    providerId,
                    email,
                    nickname
            );

        } catch (RestClientException e) {
            throw new IllegalArgumentException("카카오 사용자 정보 요청에 실패했습니다.");
        }
    }
}