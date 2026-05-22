import { request } from './httpClient';

export function getTodosByDate(date) {
  return request(`/api/todos?date=${date}`);
}

export function createTodo(todoData) {
  return request('/api/todos', {
    method: 'POST',
    body: JSON.stringify(todoData),
  });
}

export function getTodoDetail(todoId) {
  return request(`/api/todos/${todoId}`);
}

export function updateTodo(todoId, todoData) {
  return request(`/api/todos/${todoId}/update`, {
    method: 'POST',
    body: JSON.stringify(todoData),
  });
}

export function deleteTodo(todoId) {
  return request(`/api/todos/${todoId}/delete`, {
    method: 'POST',
  });
}