import { request } from './httpClient';

export function getMyCalendarTodos(year, month) {
  return request(`/api/calendar/todos?year=${year}&month=${month}`);
}

export function getFriendCalendarTodos(friendId, year, month) {
  return request(`/api/calendar/friends/${friendId}?year=${year}&month=${month}`);
}