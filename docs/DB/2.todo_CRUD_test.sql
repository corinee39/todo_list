-- 로그인 구현 전 할 일 CRUD 테스트를 위한 데이터 넣기
INSERT INTO users (
    user_id,
    email,
    nickname,
    provider,
    status,
    created_at
) VALUES (
    1,
    'test@test.com',
    '테스트유저',
    'GOOGLE',
    'ACTIVE',
    SYSTIMESTAMP
);

INSERT INTO todo_categories (
    category_id,
    user_id,
    name,
    status,
    created_at
) VALUES (
    1,
    1,
    '공부',
    'ACTIVE',
    SYSTIMESTAMP
);

COMMIT;