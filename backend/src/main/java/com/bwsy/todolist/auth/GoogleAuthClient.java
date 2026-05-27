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
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.bwsy.todolist.dto.GoogleTokenResponse;
import com.bwsy.todolist.dto.GoogleUserInfoResponse;

import lombok.RequiredArgsConstructor;

/**
 * 구글 로그인 API와 통신하는 클래스
 *
 * 역할:
 * 1. React에서 받은 구글 인가 code로 구글 access_token 요청
 * 2. 발급받은 구글 access_token으로 구글 사용자 정보 조회
 * 3. 조회한 사용자 정보를 SocialUserInfo 객체로 변환해서 AuthService에 반환
 */
@Component
@RequiredArgsConstructor
public class GoogleAuthClient {

    // 구글 access_token 발급 URL
    private static final String GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

    // 구글 사용자 정보 조회 URL
    private static final String GOOGLE_USER_INFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

    /**
     * 외부 API 요청을 보내기 위한 객체
     *
     * SecurityConfig 또는 별도 설정 클래스에서 등록한 RestTemplate Bean을 사용
     */
    private final RestTemplate restTemplate;

    @Value("${oauth.google.client-id}")
    private String googleClientId;

    @Value("${oauth.google.redirect-uri}")
    private String googleRedirectUri;

    @Value("${oauth.google.client-secret}")
    private String googleClientSecret;

    /**
     * 구글 인가 code로 최종 구글 사용자 정보를 조회하는 메서드
     *
     * 흐름:
     * 1. authorizationCode로 구글 access_token 발급
     * 2. access_token으로 구글 사용자 정보 조회
     * 3. SocialUserInfo 반환
     *
     * @param authorizationCode React에서 전달받은 구글 인가 code
     * @return 구글 사용자 정보
     */
    public SocialUserInfo getUserInfoByAuthorizationCode(String authorizationCode) {
        String googleAccessToken = requestAccessToken(authorizationCode);
        return requestUserInfo(googleAccessToken);
    }

    // 구글 인가 code로 구글 access_token을 발급받는 메서드
    private String requestAccessToken(String authorizationCode) {
        if (authorizationCode == null || authorizationCode.isBlank()) {
            throw new IllegalArgumentException("구글 인가 코드가 없습니다.");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", googleClientId);
        params.add("client_secret", googleClientSecret);
        params.add("redirect_uri", googleRedirectUri);
        params.add("code", authorizationCode);

        HttpEntity<MultiValueMap<String, String>> request =
                new HttpEntity<>(params, headers);

        try {
            ResponseEntity<GoogleTokenResponse> response =
                    restTemplate.postForEntity(
                            GOOGLE_TOKEN_URL,
                            request,
                            GoogleTokenResponse.class
                    );

            GoogleTokenResponse body = response.getBody();

            if (body == null || body.getAccessToken() == null) {
                throw new IllegalArgumentException("구글 access token 발급에 실패했습니다.");
            }

            return body.getAccessToken();

        } catch (RestClientException e) {
            throw new IllegalArgumentException("구글 access token 요청에 실패했습니다.");
        }
    }

    // 구글 access_token으로 구글 사용자 정보를 조회하는 메서드
    private SocialUserInfo requestUserInfo(String googleAccessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(googleAccessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<GoogleUserInfoResponse> response =
                    restTemplate.exchange(
                            GOOGLE_USER_INFO_URL,
                            HttpMethod.GET,
                            request,
                            GoogleUserInfoResponse.class
                    );

            GoogleUserInfoResponse body = response.getBody();

            if (body == null) {
                throw new IllegalArgumentException("구글 사용자 정보 조회에 실패했습니다.");
            }

            String providerId = body.getSub();
            String email = body.getEmail();
            String nickname = body.getName();

            if (providerId == null || providerId.isBlank()) {
                throw new IllegalArgumentException("구글 사용자 고유 ID가 없습니다.");
            }

            if (email == null || email.isBlank()) {
                throw new IllegalArgumentException("구글 이메일 제공 동의가 필요합니다.");
            }

            if (Boolean.FALSE.equals(body.getEmailVerified())) {
                throw new IllegalArgumentException("이메일 인증이 완료되지 않은 구글 계정입니다.");
            }

            if (nickname == null || nickname.isBlank()) {
                nickname = "google_user";
            }

            return new SocialUserInfo(
                    "GOOGLE",
                    providerId,
                    email,
                    nickname
            );

        } catch (RestClientException e) {
            throw new IllegalArgumentException("구글 사용자 정보 요청에 실패했습니다.");
        }
    }
}