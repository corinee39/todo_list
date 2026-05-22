import { request } from './httpClient';

export function generateAiTodos(goalData) {
  return request('/api/ai/todos', {
    method: 'POST',
    body: JSON.stringify(goalData),
  });
}