import { request } from './httpClient';

export function getPosts({ category = '', keyword = '' } = {}) {
  const params = new URLSearchParams();

  if (category) {
    params.append('category', category);
  }

  if (keyword) {
    params.append('keyword', keyword);
  }

  const queryString = params.toString();

  return request(`/api/posts${queryString ? `?${queryString}` : ''}`);
}

export function createPost(postData) {
  return request('/api/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
  });
}

export function getPostDetail(postId) {
  return request(`/api/posts/${postId}`);
}

export function updatePost(postId, postData) {
  return request(`/api/posts/${postId}/update`, {
    method: 'POST',
    body: JSON.stringify(postData),
  });
}

export function deletePost(postId) {
  return request(`/api/posts/${postId}/delete`, {
    method: 'POST',
  });
}

export function getPostComments(postId) {
  return request(`/api/posts/${postId}/comments`);
}

export function createPostComment(postId, commentData) {
  return request(`/api/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify(commentData),
  });
}

export function updateComment(commentId, commentData) {
  return request(`/api/comments/${commentId}/update`, {
    method: 'POST',
    body: JSON.stringify(commentData),
  });
}

export function deleteComment(commentId) {
  return request(`/api/comments/${commentId}/delete`, {
    method: 'POST',
  });
}