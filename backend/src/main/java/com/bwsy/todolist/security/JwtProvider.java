package com.bwsy.todolist.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

/**
 * JWT 생성 및 검증을 담당하는 클래스
 *
 * 카카오 로그인 성공 후 우리 서비스에서 사용할 JWT를 발급하고,
 * 이후 API 요청에 포함된 JWT가 유효한지 검사
 */
@Component
public class JwtProvider {

    //JWT 서명에 사용할 비밀키
    @Value("${jwt.secret}")
    private String secret;

    // Access Token 만료 시간
    @Value("${jwt.access-token-expiration-ms}")
    private long accessTokenExpirationMs;

    // JWT 서명에 사용할 SecretKey 생성
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Access Token 생성
     *
     * 카카오 로그인 성공 후 우리 서비스용 JWT를 발급할 때 사용
     *
     * @param userId 우리 서비스 users 테이블의 user_id
     * @param email 사용자 이메일
     * @param provider 로그인 제공자, 예: KAKAO
     * @return 생성된 JWT 문자열
     */
    public String createAccessToken(Long userId, String email, String provider) {
        // 토큰 발급 시간
        Date now = new Date();

        // 토큰 만료 시간 = 현재 시간 + 설정된 유효기간
        Date expiration = new Date(now.getTime() + accessTokenExpirationMs);

        return Jwts.builder()
                // subject에는 가장 중요한 식별자인 userId를 저장
                // 나중에 JWT에서 userId를 꺼내 로그인 사용자를 조회
                .subject(String.valueOf(userId))

                // 필요한 사용자 정보를 claim에 추가
                // 단, JWT는 프런트에서 확인 가능하므로 민감한 정보는 넣지 않는다.
                .claim("email", email)
                .claim("provider", provider)

                // 토큰 발급 시간
                .issuedAt(now)

                // 토큰 만료 시간
                .expiration(expiration)

                // secret key와 HS256 알고리즘으로 서명
                // 이 서명 덕분에 토큰 위조 여부를 검증 가능
                .signWith(getSigningKey(), Jwts.SIG.HS256)

                // 최종 JWT 문자열 생성
                .compact();
    }

    /**
     * JWT 유효성 검증
     *
     * 서명이 올바른지, 만료되지 않았는지 등을 확인한다.
     *
     * @param token 클라이언트가 보낸 JWT
     * @return 유효하면 true, 유효하지 않으면 false
     */
    public boolean validateToken(String token) {
        try {
            // 파싱이 성공하면 유효한 토큰
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // 서명이 잘못됐거나, 만료됐거나, 형식이 잘못된 경우
            return false;
        }
    }

    /**
     * JWT에서 userId 추출
     *
     * createAccessToken()에서 subject에 userId를 넣었기 때문에
     * 여기서는 subject 값을 꺼내 Long 타입으로 변환
     *
     * @param token 클라이언트가 보낸 JWT
     * @return JWT에 저장된 userId
     */
    public Long getUserId(String token) {
        Claims claims = parseClaims(token);
        return Long.valueOf(claims.getSubject());
    }

    /**
     * JWT를 파싱해서 Claims를 꺼내는 공통 메서드
     *
     * Claims에는 subject, email, provider, issuedAt, expiration 등의 정보가 들어 있다.
     *
     * 이 과정에서 서명 검증과 만료 시간 검증도 함께 수행된다.
     */
    private Claims parseClaims(String token) {
        return Jwts.parser()
                // JWT를 만들 때 사용한 같은 secret key로 검증
                .verifyWith(getSigningKey())

                // 파서 생성
                .build()

                // 서명된 JWT를 파싱하고 검증
                .parseSignedClaims(token)

                // JWT payload 부분의 Claims 반환
                .getPayload();
    }
}
