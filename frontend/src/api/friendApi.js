import { request } from './httpClient';

export function getFriendRequests() {
  return request('/api/friends/requests');
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

export function sendFriendRequest(friendIdentifier) {
  return request('/api/friends/requests', {
    method: 'POST',
    body: JSON.stringify({
      friendIdentifier,
    }),
  });
}

export function deleteFriend(friendId) {
  return request(`/api/friends/${friendId}`, {
    method: 'DELETE',
  });
}