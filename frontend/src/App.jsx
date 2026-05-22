import { useEffect, useState } from 'react';
import AiTodoPage from './pages/AiTodoPage';
import CategoryCreatePage from './pages/CategoryCreatePage';
import CategoryManagePage from './pages/CategoryManagePage';
import FriendListPage from './pages/FriendListPage';
import FriendRequestPage from './pages/FriendRequestPage';
import HomePage from './pages/HomePage';

const STORAGE_KEY = 'todoSections';

const DEFAULT_CATEGORY_IDS = ['selfCare', 'study', 'prepare'];

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

const INITIAL_FRIEND_REQUESTS = [
  {
    id: 'request-1',
    name: '모모',
    avatar: '🐰',
    message: '같이 공부 기록을 공유하고 싶어요.',
  },
  {
    id: 'request-2',
    name: '하니',
    avatar: '🐻',
    message: '오늘 할 일 같이 체크해요.',
  },
  {
    id: 'request-3',
    name: '도리',
    avatar: '🐱',
    message: '정보처리기사 공부 같이 해요.',
  },
];

const INITIAL_FRIENDS = [
  {
    id: 'friend-1',
    name: '진지니',
    avatar: '🐶',
    message: '뽀모도로 3세트 완료',
  },
];

function getSavedTodoSections() {
  const savedTodos = localStorage.getItem(STORAGE_KEY);

  if (!savedTodos) {
    return INITIAL_TODO_SECTIONS;
  }

  try {
    return JSON.parse(savedTodos);
  } catch (error) {
    return INITIAL_TODO_SECTIONS;
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [todoSections, setTodoSections] = useState(getSavedTodoSections);
  const [friendRequests, setFriendRequests] = useState(INITIAL_FRIEND_REQUESTS);
  const [friends, setFriends] = useState(INITIAL_FRIENDS);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todoSections));
  }, [todoSections]);

  const handleAddCategory = ({ title, theme }) => {
    const newCategory = {
      id: `category-${Date.now()}`,
      title,
      theme,
      todos: [],
    };

    setTodoSections((prevSections) => [...prevSections, newCategory]);
  };

  const handleDeleteCategory = (sectionId) => {
    if (DEFAULT_CATEGORY_IDS.includes(sectionId)) {
      alert('기본 카테고리는 삭제할 수 없습니다.');
      return;
    }

    setTodoSections((prevSections) =>
      prevSections.filter((section) => section.id !== sectionId)
    );
  };

  const handleAddTodo = (sectionId, todoTitle) => {
    const newTodo = {
      id: `${sectionId}-${Date.now()}`,
      title: todoTitle,
      completed: false,
    };

    setTodoSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id !== sectionId) {
          return section;
        }

        return {
          ...section,
          todos: [...section.todos, newTodo],
        };
      })
    );
  };

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

  const handleDeleteTodo = (sectionId, todoId) => {
    setTodoSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id !== sectionId) {
          return section;
        }

        return {
          ...section,
          todos: section.todos.filter((todo) => todo.id !== todoId),
        };
      })
    );
  };

  const handleAcceptFriendRequest = (requestId) => {
    const acceptedRequest = friendRequests.find(
      (request) => request.id === requestId
    );

    if (!acceptedRequest) {
      return;
    }

    const newFriend = {
      id: `friend-${Date.now()}`,
      name: acceptedRequest.name,
      avatar: acceptedRequest.avatar,
      message: '새로운 친구가 되었습니다.',
    };

    setFriends((prevFriends) => [...prevFriends, newFriend]);

    setFriendRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== requestId)
    );
  };

  const handleRejectFriendRequest = (requestId) => {
    setFriendRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== requestId)
    );
  };

  const handleDeleteFriend = (friendId) => {
    const isConfirmed = confirm('이 친구를 삭제할까요?');

    if (!isConfirmed) {
      return;
    }

    setFriends((prevFriends) =>
      prevFriends.filter((friend) => friend.id !== friendId)
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

  if (currentPage === 'categoryCreate') {
    return (
      <CategoryCreatePage
        onChangePage={setCurrentPage}
        onAddCategory={handleAddCategory}
      />
    );
  }

  if (currentPage === 'categoryManage') {
    return (
      <CategoryManagePage
        onChangePage={setCurrentPage}
        todoSections={todoSections}
        onDeleteCategory={handleDeleteCategory}
      />
    );
  }

  if (currentPage === 'friendRequest') {
    return (
      <FriendRequestPage
        onChangePage={setCurrentPage}
        friendRequests={friendRequests}
        friends={friends}
        onAcceptFriendRequest={handleAcceptFriendRequest}
        onRejectFriendRequest={handleRejectFriendRequest}
      />
    );
  }

  if (currentPage === 'friendList') {
    return (
      <FriendListPage
        onChangePage={setCurrentPage}
        friends={friends}
        onDeleteFriend={handleDeleteFriend}
      />
    );
  }

  return (
    <HomePage
      onChangePage={setCurrentPage}
      todoSections={todoSections}
      onAddTodo={handleAddTodo}
      onToggleTodo={handleToggleTodo}
      onDeleteTodo={handleDeleteTodo}
    />
  );
}

export default App;