import { request } from './httpClient';

export function getCategories() {
  return request('/api/categories');
}

export function createCategory(categoryData) {
  return request('/api/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
}

export function deleteCategory(categoryId) {
  return request(`/api/categories/${categoryId}`, {
    method: 'DELETE',
  });
}