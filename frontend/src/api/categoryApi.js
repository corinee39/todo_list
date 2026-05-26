import { request } from './httpClient';

const TEST_USER_ID = 1;

export function getTodoCategories() {
  return request(`/api/todo-categories?userId=${TEST_USER_ID}`);
}

export function createTodoCategory(categoryData) {
  return request('/api/todo-categories', {
    method: 'POST',
    body: JSON.stringify({
      userId: TEST_USER_ID,
      ...categoryData,
    }),
  });
}

export function updateTodoCategory(categoryId, categoryData) {
  return request(`/api/todo-categories/${categoryId}/update`, {
    method: 'POST',
    body: JSON.stringify({
      userId: TEST_USER_ID,
      ...categoryData,
    }),
  });
}

export function deleteTodoCategory(categoryId) {
  return request(`/api/todo-categories/${categoryId}/delete?userId=${TEST_USER_ID}`, {
    method: 'POST',
  });
}