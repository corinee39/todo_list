import { useState } from 'react';
import AiTodoPage from './pages/AiTodoPage';
import HomePage from './pages/HomePage';

const INITIAL_TODO_SECTIONS = [
  {
    id: 'selfCare',
    title: '나를 사랑하고 돌보기',
    theme: 'pink',
    todos: ['아침명상 / 기도 / 스트레칭', '유산균, 비타민C'],
  },
  {
    id: 'study',
    title: '공부',
    theme: 'yellow',
    todos: ['정보처리기사 필기 기출 풀이', '오답노트 정리하기'],
  },
  {
    id: 'prepare',
    title: '대화와 준비',
    theme: 'green',
    todos: ['수험표, 신분증 챙기기', '스터디 참여하기'],
  },
];

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [todoSections, setTodoSections] = useState(INITIAL_TODO_SECTIONS);

  const handleAddAiTodos = (selectedTodos) => {
    setTodoSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id !== 'study') {
          return section;
        }

        return {
          ...section,
          todos: [...section.todos, ...selectedTodos],
        };
      })
    );
  };

  if (currentPage === 'aiTodo') {
    return (
      <AiTodoPage
        onChangePage={setCurrentPage}
        onAddAiTodos={handleAddAiTodos}
      />
    );
  }

  return (
    <HomePage
      onChangePage={setCurrentPage}
      todoSections={todoSections}
    />
  );
}

export default App;