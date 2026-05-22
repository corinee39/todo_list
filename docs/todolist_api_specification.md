# 개발자를 위한 투두리스트 서비스 API 명세서

## 1. 문서 개요

이 문서는 개발자를 위한 투두리스트 서비스의 API 명세서이다.

---

## 2. API 목록

## 2.1 인증 API

| API                         | React 작업                 | Spring Boot 작업                                      |
| --------------------------- | -------------------------- | ----------------------------------------------------- |
| POST /api/auth/kakao        | 카카오 로그인 후 토큰 전달 | 카카오 사용자 검증, 회원 저장, JWT 발급               |
| POST /api/auth/google       | 구글 로그인 후 토큰 전달   | 구글 사용자 검증, 회원 저장, JWT 발급                 |
| GET /api/members/me         | 내 정보 화면 표시          | 로그인 사용자 정보 반환                               |
| POST /api/members/me/update | 닉네임 수정 폼             | 닉네임 변경                                           |
| POST /api/members/me/delete | 회원 탈퇴 요청             | 로그인 사용자 계정을 DELETED 처리하고 deleted_at 저장 |

---

## 2.2 할 일 API

| API                             | React 작업                                           | Spring Boot 작업                                       |
| ------------------------------- | ---------------------------------------------------- | ------------------------------------------------------ |
| GET /api/todos?date=YYYY-MM-DD  | 선택 날짜 할 일 목록 표시                            | 내 할 일 목록 조회                                     |
| POST /api/todos                 | 할 일 등록 요청                                      | 할 일 저장                                             |
| GET /api/todos/{todoId}         | 상세 모달 표시                                       | 상세 조회                                              |
| POST /api/todos/{todoId}/update | 제목, 내용, 날짜, 카테고리, 우선순위, 상태 수정 요청 | 본인 검증 후 수정, status가 DONE이면 completed_at 저장 |
| POST /api/todos/{todoId}/delete | 삭제 요청                                            | 본인 검증 후 deleted_at 저장                           |

---

## 2.3 카테고리 API

| API                                           | React 작업            | Spring Boot 작업                  |
| --------------------------------------------- | --------------------- | --------------------------------- |
| GET /api/todo-categories                      | 내 카테고리 목록 표시 | 로그인 사용자 카테고리 조회       |
| POST /api/todo-categories                     | 카테고리 등록 요청    | 카테고리 저장                     |
| POST /api/todo-categories/{categoryId}/update | 카테고리명 수정 요청  | 본인 카테고리 검증 후 수정        |
| POST /api/todo-categories/{categoryId}/delete | 카테고리 삭제 요청    | 본인 카테고리 검증 후 소프트 삭제 |

---

## 2.4 달력 API

| API                                                    | React 작업     | Spring Boot 작업                |
| ------------------------------------------------------ | -------------- | ------------------------------- |
| GET /api/calendar/todos?year=2026&month=5              | 달력에 표시    | 날짜별 할 일 개수, 완료 수 반환 |
| GET /api/calendar/friends/{friendId}?year=2026&month=5 | 친구 달력 표시 | 친구 관계 검증 후 요약 반환     |

---

## 2.5 친구 API

| API                                           | React 작업            | Spring Boot 작업                             |
| --------------------------------------------- | --------------------- | -------------------------------------------- |
| GET /api/members/search?keyword=              | 사용자 검색 결과 표시 | 닉네임/이메일 검색                           |
| POST /api/friends/requests                    | 친구 요청             | 중복 검증 후 요청 저장                       |
| GET /api/friends/requests/received            | 받은 요청 목록 표시   | 받은 요청 조회                               |
| POST /api/friends/requests/{requestId}/accept | 수락 버튼             | 요청 수락                                    |
| POST /api/friends/requests/{requestId}/reject | 거절 버튼             | 요청 거절                                    |
| GET /api/friends                              | 친구 목록 표시        | 친구 목록 조회                               |
| POST /api/friends/{friendId}/delete           | 친구 삭제             | 친구 관계를 DELETED 처리하고 deleted_at 저장 |

---

## 2.6 친구 투두 API

| API                                               | React 작업           | Spring Boot 작업       |
| ------------------------------------------------- | -------------------- | ---------------------- |
| GET /api/friends/{friendId}/todos?date=YYYY-MM-DD | 친구 할 일 목록 표시 | 친구 관계 검증 후 조회 |
| GET /api/friends/{friendId}/todos/{todoId}        | 친구 할 일 상세 표시 | 읽기 전용 상세 조회    |

---

## 2.7 커뮤니티 API

| API                                   | React 작업                            | Spring Boot 작업                                           |
| ------------------------------------- | ------------------------------------- | ---------------------------------------------------------- |
| GET /api/posts                        | 게시글 목록 표시                      | 전체 게시글 목록 조회                                      |
| GET /api/posts?category=&keyword=     | 게시글 목록, 검색, 카테고리 필터 표시 | 삭제되지 않은 게시글 목록 조회, 검색, 카테고리 필터 처리   |
| POST /api/posts                       | 게시글 등록                           | 로그인 사용자 기준 저장                                    |
| GET /api/posts/{postId}               | 상세 화면 표시                        | 상세 조회, 조회수 증가                                     |
| POST /api/posts/{postId}/update       | 게시글 수정                           | 작성자 검증 후 수정                                        |
| POST /api/posts/{postId}/delete       | 게시글 삭제                           | 작성자 검증 후 status를 DELETED로 변경하고 deleted_at 저장 |
| GET /api/posts/{postId}/comments      | 댓글 목록 표시                        | 삭제되지 않은 댓글 목록 조회                               |
| POST /api/posts/{postId}/comments     | 댓글 등록                             | 댓글 저장                                                  |
| POST /api/comments/{commentId}/update | 댓글 수정                             | 작성자 검증 후 수정                                        |
| POST /api/comments/{commentId}/delete | 댓글 삭제                             | 작성자 검증 후 status를 DELETED로 변경하고 deleted_at 저장 |

---

## 3. API 설계 기준

## 3.1 HTTP Method 기준

| Method | 사용 목적                    |
| ------ | ---------------------------- |
| GET    | 데이터 조회                  |
| POST   | 데이터 등록, 수정, 삭제 처리 |

이 프로젝트에서는 `PATCH`, `DELETE` 방식을 사용하지 않고 `GET`, `POST` 방식만 사용한다.

---
