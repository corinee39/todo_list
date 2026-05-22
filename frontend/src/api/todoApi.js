import { request } from './httpClient';

export function getTodos() {
  return request('/api/todos');
}

export function createTodo(todoData) {
  return request('/api/todos', {
    method: 'POST',
    body: JSON.stringify(todoData),
  });
}

export function updateTodo(todoId, todoData) {
  return request(`/api/todos/${todoId}`, {
    method: 'PATCH',
    body: JSON.stringify(todoData),
  });
}

export function deleteTodo(todoId) {
  return request(`/api/todos/${todoId}`, {
    method: 'DELETE',
  });
}