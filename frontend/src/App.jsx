import { useState } from 'react';
import AiTodoPage from './pages/AiTodoPage';
import HomePage from './pages/HomePage';

const INITIAL_TODO_SECTIONS = [
  {
    id: 'selfCare',
    title: '나를 사랑하고 돌보기',
    theme: 'pink',
    todos: [
      {
        id: 'self-1',
        title: '아침명상 / 기도 / 스트레칭',
        completed: false,
      },
      {
        id: 'self-2',
        title: '유산균, 비타민C',
        completed: false,
      },
    ],
  },
  {
    id: 'study',
    title: '공부',
    theme: 'yellow',
    todos: [
      {
        id: 'study-1',
        title: '정보처리기사 필기 기출 풀이',
        completed: false,
      },
      {
        id: 'study-2',
        title: '오답노트 정리하기',
        completed: false,
      },
    ],
  },
  {
    id: 'prepare',
    title: '대화와 준비',
    theme: 'green',
    todos: [
      {
        id: 'prepare-1',
        title: '수험표, 신분증 챙기기',
        completed: false,
      },
      {
        id: 'prepare-2',
        title: '스터디 참여하기',
        completed: false,
      },
    ],
  },
];

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [todoSections, setTodoSections] = useState(INITIAL_TODO_SECTIONS);

  const handleAddAiTodos = (selectedTodos) => {
    const newTodos = selectedTodos.map((todo, index) => ({
      id: `ai-${Date.now()}-${index}`,
      title: todo,
      completed: false,
    }));

    setTodoSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id !== 'study') {
          return section;
        }

        return {
          ...section,
          todos: [...section.todos, ...newTodos],
        };
      })
    );
  };

  const handleToggleTodo = (sectionId, todoId) => {
    setTodoSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id !== sectionId) {
          return section;
        }

        return {
          ...section,
          todos: section.todos.map((todo) =>
            todo.id === todoId
              ? { ...todo, completed: !todo.completed }
              : todo
          ),
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
      onToggleTodo={handleToggleTodo}
    />
  );
}

export default App;