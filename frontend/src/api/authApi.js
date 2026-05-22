import { request, removeAccessToken, setAccessToken } from './httpClient';

export async function loginWithKakao(kakaoToken) {
  const result = await request('/api/auth/kakao', {
    method: 'POST',
    body: JSON.stringify({
      token: kakaoToken,
    }),
  });

  if (result.accessToken) {
    setAccessToken(result.accessToken);
  }

  return result;
}

export async function loginWithGoogle(googleToken) {
  const result = await request('/api/auth/google', {
    method: 'POST',
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
  return request('/api/members/me');
}

export function updateMyInfo(memberData) {
  return request('/api/members/me/update', {
    method: 'POST',
    body: JSON.stringify(memberData),
  });
}

export function deleteMyAccount() {
  return request('/api/members/me/delete', {
    method: 'POST',
  });
}

export function logout() {
  removeAccessToken();
}