import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import {
  createTodoCategory,
  deleteTodoCategory,
  getTodoCategories,
} from "./api/categoryApi";
import {
  createTodo,
  deleteTodo,
  getTodosByDate,
  updateTodo,
} from "./api/todoApi";
import AiTodoPage from "./pages/AiTodoPage";
import BoardPage from "./pages/BoardPage";
import CategoryCreatePage from "./pages/CategoryCreatePage";
import CategoryManagePage from "./pages/CategoryManagePage";
import FriendListPage from "./pages/FriendListPage";
import FriendRequestPage from "./pages/FriendRequestPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MyPage from "./pages/MyPage";

const AUTH_STORAGE_KEY = "isLoggedIn";
const DEFAULT_TODO_DATE = "2026-05-22";

const CATEGORY_THEMES = ["yellow", "pink", "green", "purple", "blue"];

const INITIAL_FRIEND_REQUESTS = [
  {
    id: "request-1",
    name: "모모",
    avatar: "🐰",
    message: "같이 공부 기록을 공유하고 싶어요.",
  },
  {
    id: "request-2",
    name: "하니",
    avatar: "🐻",
    message: "오늘 할 일 같이 체크해요.",
  },
  {
    id: "request-3",
    name: "도리",
    avatar: "🐱",
    message: "정보처리기사 공부 같이 해요.",
  },
];

const INITIAL_FRIENDS = [
  {
    id: "friend-1",
    name: "진지니",
    avatar: "🐶",
    message: "뽀모도로 3세트 완료",
  },
];

const INITIAL_BOARD_POSTS = [
  {
    id: "post-1",
    title: "정보처리기사 필기 공부 시작",
    content: "오늘은 운영체제와 데이터베이스 위주로 공부할 예정입니다.",
    createdAt: "2026.05.22",
  },
  {
    id: "post-2",
    title: "AI 할 일 생성 기능 정리",
    content: "목표를 입력하면 할 일을 쪼개주는 흐름으로 구현했습니다.",
    createdAt: "2026.05.22",
  },
];

const PAGE_PATHS = {
  home: "/",
  aiTodo: "/ai-todos",
  categoryCreate: "/categories/new",
  categoryManage: "/categories",
  friendRequest: "/friends/requests",
  friendList: "/friends",
  myPage: "/my",
  board: "/board",
  login: "/login",
};

function getSavedLoginStatus() {
  return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

function getArrayData(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  return [];
}

function convertCategoryToSection(category, index, selectedTheme) {
  return {
    id: String(category.categoryId ?? category.id),
    categoryId: category.categoryId ?? category.id,
    title: category.name ?? category.title,
    theme: selectedTheme || CATEGORY_THEMES[index % CATEGORY_THEMES.length],
    todos: [],
  };
}

function convertTodoFromBackend(todo, selectedDate) {
  return {
    id: String(todo.todoId ?? todo.id),
    todoId: todo.todoId ?? todo.id,
    categoryId: todo.categoryId,
    title: todo.title,
    content: todo.content || "",
    status: todo.status || "WAITING",
    priority: todo.priority || "MEDIUM",
    completed:
      todo.completed === true ||
      todo.status === "DONE" ||
      Boolean(todo.completedAt),
    todoDate: todo.todoDate?.slice(0, 10) || selectedDate,
  };
}

function App() {
  return <AppRoutes />;
}

function AppRoutes() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(getSavedLoginStatus);
  const [selectedDate, setSelectedDate] = useState(DEFAULT_TODO_DATE);
  const [todoSections, setTodoSections] = useState([]);
  const [friendRequests, setFriendRequests] = useState(INITIAL_FRIEND_REQUESTS);
  const [friends, setFriends] = useState(INITIAL_FRIENDS);
  const [boardPosts, setBoardPosts] = useState(INITIAL_BOARD_POSTS);

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    loadCategoriesAndTodos(selectedDate);
  }, [isLoggedIn, selectedDate]);

  const loadCategoriesAndTodos = async (date) => {
    try {
      const [categoryResult, todoResult] = await Promise.all([
        getTodoCategories(),
        getTodosByDate(date),
      ]);

      const categories = getArrayData(categoryResult);
      const todos = getArrayData(todoResult).map((todo) =>
        convertTodoFromBackend(todo, date),
      );

      const sections = categories.map((category, index) => {
        const section = convertCategoryToSection(category, index);
        const sectionTodos = todos.filter(
          (todo) => Number(todo.categoryId) === Number(section.categoryId),
        );

        return {
          ...section,
          todos: sectionTodos,
        };
      });

      setTodoSections(sections);
      console.log("백엔드 카테고리/투두 조회 결과:", sections);
    } catch (error) {
      console.error("백엔드 카테고리/투두 조회 실패:", error);
    }
  };

  const handleChangePage = (pageName) => {
    const path = PAGE_PATHS[pageName] || "/";
    navigate(path);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("/");
  };

  const handleLogout = () => {
    const isConfirmed = confirm("로그아웃할까요?");

    if (!isConfirmed) {
      return;
    }

    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleAddCategory = async ({ title, theme }) => {
    const savedCategory = await createTodoCategory({
      name: title,
    });

    const category = {
      ...savedCategory,
      name: savedCategory?.name || title,
    };

    setTodoSections((prevSections) => [
      ...prevSections,
      convertCategoryToSection(category, prevSections.length, theme),
    ]);
  };

  const handleDeleteCategory = async (sectionId) => {
    const targetSection = todoSections.find(
      (section) => section.id === sectionId,
    );

    if (!targetSection?.categoryId) {
      alert("삭제할 카테고리 정보를 찾을 수 없습니다.");
      return;
    }

    const isConfirmed = confirm("이 카테고리를 삭제할까요?");

    if (!isConfirmed) {
      return;
    }

    try {
      await deleteTodoCategory(targetSection.categoryId);
      await loadCategoriesAndTodos(selectedDate);
    } catch (error) {
      console.error(error);
      alert("카테고리 삭제에 실패했습니다.");
    }
  };

  const handleAddTodo = async (sectionId, todoTitle) => {
    const targetSection = todoSections.find(
      (section) => section.id === sectionId,
    );

    if (!targetSection?.categoryId) {
      alert("카테고리 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      const savedTodo = await createTodo({
        categoryId: targetSection.categoryId,
        title: todoTitle,
        content: "",
        todoDate: selectedDate,
        priority: "MEDIUM",
      });

      console.log("백엔드 투두 등록 결과:", savedTodo);

      await loadCategoriesAndTodos(selectedDate);
    } catch (error) {
      console.error("백엔드 투두 등록 실패:", error);
      alert("할 일 등록에 실패했습니다. 백엔드 로그를 확인해주세요.");
    }
  };

  const handleAddAiTodos = async (selectedTodos, categoryId) => {
    if (!categoryId) {
      alert("AI 할 일을 추가할 카테고리를 선택해주세요.");
      return;
    }

    try {
      await Promise.all(
        selectedTodos.map((todoTitle) =>
          createTodo({
            categoryId,
            title: todoTitle,
            content: "",
            todoDate: selectedDate,
            priority: "MEDIUM",
          }),
        ),
      );

      await loadCategoriesAndTodos(selectedDate);
    } catch (error) {
      console.error(error);
      alert("AI 할 일 추가에 실패했습니다.");
    }
  };

  const handleToggleTodo = async (sectionId, todoId) => {
    const targetSection = todoSections.find(
      (section) => section.id === sectionId,
    );

    if (!targetSection) {
      alert("카테고리 정보를 찾을 수 없습니다.");
      return;
    }

    const targetTodo = targetSection.todos.find(
      (todo) => String(todo.id) === String(todoId),
    );

    if (!targetTodo) {
      alert("할 일 정보를 찾을 수 없습니다.");
      return;
    }

    const nextStatus = targetTodo.completed ? "WAITING" : "DONE";

    try {
      await updateTodo(targetTodo.todoId || targetTodo.id, {
        categoryId: targetTodo.categoryId,
        title: targetTodo.title,
        content: targetTodo.content || "",
        todoDate: targetTodo.todoDate,
        status: nextStatus,
        priority: targetTodo.priority || "MEDIUM",
      });

      await loadCategoriesAndTodos(selectedDate);
    } catch (error) {
      console.error("할 일 상태 변경 실패:", error);
      alert("할 일 상태 변경에 실패했습니다.");
    }
  };

  const handleDeleteTodo = async (sectionId, todoId) => {
    const isConfirmed = confirm("이 할 일을 삭제할까요?");

    if (!isConfirmed) {
      return;
    }

    try {
      await deleteTodo(todoId);
      await loadCategoriesAndTodos(selectedDate);
    } catch (error) {
      console.error(error);
      alert("할 일 삭제에 실패했습니다.");
    }
  };

  const handleAcceptFriendRequest = (requestId) => {
    const acceptedRequest = friendRequests.find(
      (request) => request.id === requestId,
    );

    if (!acceptedRequest) {
      return;
    }

    const newFriend = {
      id: `friend-${Date.now()}`,
      name: acceptedRequest.name,
      avatar: acceptedRequest.avatar,
      message: "새로운 친구가 되었습니다.",
    };

    setFriends((prevFriends) => [...prevFriends, newFriend]);

    setFriendRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== requestId),
    );
  };

  const handleRejectFriendRequest = (requestId) => {
    setFriendRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== requestId),
    );
  };

  const handleDeleteFriend = (friendId) => {
    const isConfirmed = confirm("이 친구를 삭제할까요?");

    if (!isConfirmed) {
      return;
    }

    setFriends((prevFriends) =>
      prevFriends.filter((friend) => friend.id !== friendId),
    );
  };

  const handleAddBoardPost = ({ title, content }) => {
    const newPost = {
      id: `post-${Date.now()}`,
      title,
      content,
      createdAt: "오늘",
    };

    setBoardPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            onChangePage={handleChangePage}
            onLogout={handleLogout}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            todoSections={todoSections}
            onAddTodo={handleAddTodo}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
          />
        }
      />

      <Route
        path="/ai-todos"
        element={
          <AiTodoPage
            onChangePage={handleChangePage}
            todoSections={todoSections}
            onAddAiTodos={handleAddAiTodos}
          />
        }
      />

      <Route
        path="/categories/new"
        element={
          <CategoryCreatePage
            onChangePage={handleChangePage}
            onAddCategory={handleAddCategory}
          />
        }
      />

      <Route
        path="/categories"
        element={
          <CategoryManagePage
            onChangePage={handleChangePage}
            todoSections={todoSections}
            onDeleteCategory={handleDeleteCategory}
          />
        }
      />

      <Route
        path="/friends/requests"
        element={
          <FriendRequestPage
            onChangePage={handleChangePage}
            friendRequests={friendRequests}
            friends={friends}
            onAcceptFriendRequest={handleAcceptFriendRequest}
            onRejectFriendRequest={handleRejectFriendRequest}
          />
        }
      />

      <Route
        path="/friends"
        element={
          <FriendListPage
            onChangePage={handleChangePage}
            friends={friends}
            onDeleteFriend={handleDeleteFriend}
          />
        }
      />

      <Route
        path="/my"
        element={
          <MyPage onChangePage={handleChangePage} todoSections={todoSections} />
        }
      />

      <Route
        path="/board"
        element={
          <BoardPage
            onChangePage={handleChangePage}
            boardPosts={boardPosts}
            onAddBoardPost={handleAddBoardPost}
          />
        }
      />

      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
