import { useState } from 'react';
import AiTodoPage from './pages/AiTodoPage';
import HomePage from './pages/HomePage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  if (currentPage === 'aiTodo') {
    return <AiTodoPage onChangePage={setCurrentPage} />;
  }

  return <HomePage onChangePage={setCurrentPage} />;
}

export default App;