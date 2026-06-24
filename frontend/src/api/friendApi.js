import { request } from './httpClient';

export function searchMembers(keyword) {
  return request(`/api/members/search?keyword=${encodeURIComponent(keyword)}`);
}

export function sendFriendRequest(receiverId) {
  return request('/api/friends/requests', {
    method: 'POST',
    body: JSON.stringify({
      receiverId,
    }),
  });
}

export function getReceivedFriendRequests() {
  return request('/api/friends/requests/received');
}

export function acceptFriendRequest(requestId) {
  return request(`/api/friends/requests/${requestId}/accept`, {
    method: 'POST',
  });
}

export function rejectFriendRequest(requestId) {
  return request(`/api/friends/requests/${requestId}/reject`, {
    method: 'POST',
  });
}

export function getFriends() {
  return request('/api/friends');
}

export function deleteFriend(friendId) {
  return request(`/api/friends/${friendId}/delete`, {
    method: 'POST',
  });
}

export function getFriendTodos(friendId, date) {
  return request(`/api/friends/${friendId}/todos?date=${date}`);
}

export function getFriendTodoDatesByMonth(friendId, year, month) {
  return request(`/api/friends/${friendId}/todos/month?year=${year}&month=${month}`);
}

export function getFriendTodoDetail(friendId, todoId) {
  return request(`/api/friends/${friendId}/todos/${todoId}`);
}