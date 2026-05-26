import { request } from './httpClient';

const TEST_USER_ID = 1;

export function getTodosByDate(date) {
  return request(`/api/todos?userId=${TEST_USER_ID}&date=${date}`);
}

export function createTodo(todoData) {
  return request(`/api/todos?userId=${TEST_USER_ID}`, {
    method: 'POST',
    body: JSON.stringify(todoData),
  });
}

export function getTodoDetail(todoId) {
  return request(`/api/todos/${todoId}?userId=${TEST_USER_ID}`);
}

export function updateTodo(todoId, todoData) {
  return request(`/api/todos/${todoId}/update?userId=${TEST_USER_ID}`, {
    method: 'POST',
    body: JSON.stringify(todoData),
  });
}

export function deleteTodo(todoId) {
  return request(`/api/todos/${todoId}/delete?userId=${TEST_USER_ID}`, {
    method: 'POST',
  });
}