package com.bwsy.todolist.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.bwsy.todolist.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    // 요청마다 Authorization 헤더의 JWT를 검사하는 필터
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // application.properties 또는 .env에서 가져온 허용 origin
    // 예: http://localhost:5173
    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // React에서 오는 요청을 허용하기 위해 CORS 설정 사용
                .cors(Customizer.withDefaults())

                // JWT 방식에서는 서버 세션을 사용하지 않으므로 CSRF 보호가 필요하지 않음
                .csrf(AbstractHttpConfigurer::disable)

                // 일반 아이디/비밀번호 로그인 화면 사용 안 함
                .formLogin(AbstractHttpConfigurer::disable)

                // Basic 인증 사용 안 함
                .httpBasic(AbstractHttpConfigurer::disable)

                // JWT 인증은 서버에 로그인 세션을 저장하지 않음
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 인증 실패 시 기본 HTML 에러 페이지 대신 JSON 응답 반환
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"message\":\"로그인이 필요합니다.\"}");
                        })
                )

                // URL별 접근 권한 설정
                .authorizeHttpRequests(auth -> auth
                        // 브라우저의 CORS 사전 요청은 항상 허용
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 카카오/구글 로그인 API는 JWT가 없어도 호출 가능해야 함
                        .requestMatchers(
                                "/api/auth/kakao",
                                "/api/auth/google"
                        ).permitAll()

                        // 게시글 목록 조회, 검색, 상세 조회는 로그인 없이 허용
                        .requestMatchers(HttpMethod.GET, "/api/posts").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/posts/*").permitAll()

                        // 댓글 목록 조회는 로그인 없이 허용
                        .requestMatchers(HttpMethod.GET, "/api/posts/*/comments").permitAll()

                        // 게시글 등록, 수정, 삭제는 로그인 필요
                        .requestMatchers(HttpMethod.POST,
                                "/api/posts",
                                "/api/posts/*/update",
                                "/api/posts/*/delete"
                        ).authenticated()

                        // 댓글 등록, 수정, 삭제는 로그인 필요
                        .requestMatchers(HttpMethod.POST,
                                "/api/posts/*/comments",
                                "/api/comments/*/update",
                                "/api/comments/*/delete"
                        ).authenticated()

                        // Spring Boot 내부 에러 경로 허용
                        .requestMatchers("/error").permitAll()

                        // 나머지 API는 로그인 후 발급받은 JWT가 있어야 접근 가능
                        .anyRequest().authenticated()
                )

                // Spring Security 기본 인증 필터 전에 JWT 필터를 먼저 실행
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )

                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 허용할 React 개발 서버 주소
        // application.properties:
        // app.cors.allowed-origins=http://localhost:5173
        config.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));

        // 현재 프로젝트는 GET, POST 중심으로 API를 설계했으므로 이 정도면 충분
        config.setAllowedMethods(Arrays.asList("GET", "POST", "OPTIONS"));

        // React에서 JSON 요청과 JWT Authorization 헤더를 보낼 수 있도록 허용
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));

        // JWT를 쿠키가 아니라 Authorization 헤더로 보낼 것이므로 false
        config.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        // 모든 API 경로에 위 CORS 설정 적용
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    public RestTemplate restTemplate() {
        // 카카오 토큰 요청, 카카오 사용자 정보 조회에 사용할 HTTP 클라이언트
        return new RestTemplate();
    }
}
