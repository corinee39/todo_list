import { request } from './httpClient';

export function getTodoCategories() {
  return request('/api/todo-categories');
}

export function createTodoCategory(categoryData) {
  return request('/api/todo-categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
}

export function updateTodoCategory(categoryId, categoryData) {
  return request(`/api/todo-categories/${categoryId}/update`, {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
}

export function deleteTodoCategory(categoryId) {
  return request(`/api/todo-categories/${categoryId}/delete`, {
    method: 'POST',
  });
}