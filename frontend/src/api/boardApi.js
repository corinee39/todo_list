import { request } from './httpClient';

export function getBoardPosts() {
  return request('/api/boards');
}

export function createBoardPost(postData) {
  return request('/api/boards', {
    method: 'POST',
    body: JSON.stringify(postData),
  });
}

export function getBoardPost(postId) {
  return request(`/api/boards/${postId}`);
}

export function updateBoardPost(postId, postData) {
  return request(`/api/boards/${postId}`, {
    method: 'PUT',
    body: JSON.stringify(postData),
  });
}

export function deleteBoardPost(postId) {
  return request(`/api/boards/${postId}`, {
    method: 'DELETE',
  });
}