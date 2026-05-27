import { request, removeAccessToken, setAccessToken } from './httpClient';

function saveTokenFromResult(result) {
  const accessToken =
    result?.accessToken ||
    result?.token ||
    result?.jwt ||
    result?.access_token;

  if (!accessToken) {
    throw new Error('백엔드 응답에 accessToken이 없습니다.');
  }

  setAccessToken(accessToken);
  return accessToken;
}

export async function loginWithKakaoCode(code) {
  const result = await request('/api/auth/kakao', {
    method: 'POST',
    body: JSON.stringify({
      token: code,
    }),
  });

  saveTokenFromResult(result);
  return result;
}

export async function loginWithGoogleCode(code) {
  const result = await request('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({
      token: code,
    }),
  });

  saveTokenFromResult(result);
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