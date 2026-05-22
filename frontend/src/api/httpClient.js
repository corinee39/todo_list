const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || 'API 요청에 실패했습니다.');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}