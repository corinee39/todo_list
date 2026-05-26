import { request, removeAccessToken, setAccessToken } from "./httpClient";

export async function loginWithKakao(kakaoCode) {
  const result = await request("/api/auth/kakao", {
    method: "POST",
    body: JSON.stringify({
      // 백엔드 SocialLoginRequest의 token 필드로 전달
      // 실제 값은 카카오 access token이 아니라 카카오 인가 code
      token: kakaoCode,
    }),
  });

  if (result.accessToken) {
    setAccessToken(result.accessToken);
  }

  return result;
}

export async function loginWithGoogle(googleToken) {
  const result = await request("/api/auth/google", {
    method: "POST",
    body: JSON.stringify({
      token: googleToken,
    }),
  });

  if (result.accessToken) {
    setAccessToken(result.accessToken);
  }

  return result;
}

export function getMyInfo() {
  return request("/api/members/me");
}

export function updateMyInfo(memberData) {
  return request("/api/members/me/update", {
    method: "POST",
    body: JSON.stringify(memberData),
  });
}

export function deleteMyAccount() {
  return request("/api/members/me/delete", {
    method: "POST",
  });
}

export function logout() {
  removeAccessToken();
}
