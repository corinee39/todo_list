import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router';
import { getAccessToken } from './api/httpClient';
import { getMyInfo, logout } from './api/authApi';
import {
  createTodoCategory,
  deleteTodoCategory,
  getTodoCategories,
} from './api/categoryApi';
import {
  createTodo,
  deleteTodo,
  getTodoDatesByMonth,
  getTodosByDate,
  updateTodo,
} from './api/todoApi';
import {
  acceptFriendRequest,
  deleteFriend,
  getFriends,
  getReceivedFriendRequests,
  rejectFriendRequest,
  searchMembers,
  sendFriendRequest,
} from './api/friendApi';
import { createPost, getPosts } from './api/postApi';
import AiTodoPage from './pages/AiTodoPage';
import BoardPage from './pages/BoardPage';
import CategoryCreatePage from './pages/CategoryCreatePage';
import CategoryManagePage from './pages/CategoryManagePage';
import FriendListPage from './pages/FriendListPage';
import FriendRequestPage from './pages/FriendRequestPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MyPage from './pages/MyPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';

const CATEGORY_THEMES = ['yellow', 'pink', 'green', 'purple', 'blue'];

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const PAGE_PATHS = {
  home: '/',
  aiTodo: '/ai-todos',
  categoryCreate: '/categories/new',
  categoryManage: '/categories',
  friendRequest: '/friends/requests',
  friendList: '/friends',
  myPage: '/my',
  board: '/board',
  login: '/login',
};

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

const POST_CATEGORY_LABELS = {
  FREE: '자유',
  QUESTION: '질문',
  TIP: '팁',
  STUDY: '공부',
  ERROR: '에러',
};

function getAvatarText(nickname) {
  if (nickname && nickname.trim()) {
    return nickname.trim().charAt(0);
  }

  return '🙂';
}

function formatDateTime(value) {
  if (!value) {
    return '';
  }

  return String(value).slice(0, 10).replaceAll('-', '.');
}

function convertFriendFromBackend(friend) {
  return {
    id: String(friend.friendId),
    userId: friend.userId,
    name: friend.nickname,
    email: friend.email,
    avatar: getAvatarText(friend.nickname),
    message: friend.email,
  };
}

function convertFriendRequestFromBackend(request) {
  return {
    id: String(request.requestId),
    requesterId: request.requesterId,
    name: request.requesterNickname,
    email: request.requesterEmail,
    avatar: getAvatarText(request.requesterNickname),
    message: request.requesterEmail,
  };
}

function convertPostFromBackend(post) {
  return {
    id: String(post.postId),
    title: post.title,
    content: post.content,
    category: post.category,
    categoryLabel: POST_CATEGORY_LABELS[post.category] || '자유',
    author: post.nickname || '익명',
    createdAt: formatDateTime(post.createdAt),
  };
}

function convertTodoFromBackend(todo, selectedDate) {
  return {
    id: String(todo.todoId ?? todo.id),
    todoId: todo.todoId ?? todo.id,
    categoryId: todo.categoryId,
    title: todo.title,
    content: todo.content || '',
    status: todo.status || 'WAITING',
    priority: todo.priority || 'MEDIUM',
    completed:
      todo.completed === true ||
      todo.status === 'DONE' ||
      Boolean(todo.completedAt),
    todoDate: todo.todoDate?.slice(0, 10) || selectedDate,
  };
}

function App() {
  return <AppRoutes />;
}

function AppRoutes() {
  const navigate = useNavigate();

  const today = getTodayDateString();

  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(getAccessToken()));
  const [selectedDate, setSelectedDate] = useState(today);
  const [todoSections, setTodoSections] = useState([]);
  const [markedDates, setMarkedDates] = useState([]);
  const [calendarYear, setCalendarYear] = useState(Number(today.slice(0, 4)));
  const [calendarMonth, setCalendarMonth] = useState(Number(today.slice(5, 7)));
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [boardPosts, setBoardPosts] = useState([]);

  useEffect(() => {
    async function checkLoginStatus() {
      if (!getAccessToken()) {
        setIsLoggedIn(false);
        setTodoSections([]);
        return;
      }

      try {
        await getMyInfo();
        setIsLoggedIn(true);
      } catch (error) {
        logout();
        setIsLoggedIn(false);
        setTodoSections([]);
      }
    }

    checkLoginStatus();
  }, []);

  const requireLogin = () => {
    if (isLoggedIn) {
      return true;
    }

    alert('로그인이 필요한 기능입니다.');
    navigate('/login');
    return false;
  };

  const loadCategoriesAndTodos = async (date) => {
    try {
      const [categoryResult, todoResult] = await Promise.all([
        getTodoCategories(),
        getTodosByDate(date),
      ]);

      const categories = getArrayData(categoryResult);
      const todos = getArrayData(todoResult).map((todo) =>
        convertTodoFromBackend(todo, date)
      );

      const sections = categories.map((category, index) => {
        const section = convertCategoryToSection(category, index);
        const sectionTodos = todos.filter(
          (todo) => Number(todo.categoryId) === Number(section.categoryId)
        );

        return {
          ...section,
          todos: sectionTodos,
        };
      });

      setTodoSections(sections);
    } catch (error) {
      console.error('백엔드 카테고리/투두 조회 실패:', error);
    }
  };

  // 달력 점 표시용: 보고 있는 달에 할 일이 있는 날짜 목록을 조회
  const loadMarkedDates = async (year, month) => {
    try {
      const result = await getTodoDatesByMonth(year, month);

      const dates = getArrayData(result).map((date) =>
        String(date).slice(0, 10)
      );

      setMarkedDates(dates);
    } catch (error) {
      console.error('월별 할 일 날짜 조회 실패:', error);
      setMarkedDates([]);
    }
  };

  const refreshMarkedDates = () => {
    if (isLoggedIn) {
      loadMarkedDates(calendarYear, calendarMonth);
    }
  };

  const handleChangeCalendarMonth = (year, month) => {
    setCalendarYear(year);
    setCalendarMonth(month);
  };

  const loadFriends = async () => {
    try {
      const result = await getFriends();
      setFriends(getArrayData(result).map(convertFriendFromBackend));
    } catch (error) {
      console.error('친구 목록 조회 실패:', error);
      setFriends([]);
    }
  };

  const loadReceivedRequests = async () => {
    try {
      const result = await getReceivedFriendRequests();
      setFriendRequests(
        getArrayData(result).map(convertFriendRequestFromBackend)
      );
    } catch (error) {
      console.error('받은 친구 요청 조회 실패:', error);
      setFriendRequests([]);
    }
  };

  const loadBoardPosts = async () => {
    try {
      const result = await getPosts();
      setBoardPosts(getArrayData(result).map(convertPostFromBackend));
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);
      setBoardPosts([]);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setTodoSections([]);
      return;
    }

    loadCategoriesAndTodos(selectedDate);
  }, [isLoggedIn, selectedDate]);

  useEffect(() => {
    if (!isLoggedIn) {
      setMarkedDates([]);
      return;
    }

    loadMarkedDates(calendarYear, calendarMonth);
  }, [isLoggedIn, calendarYear, calendarMonth]);

  useEffect(() => {
    if (!isLoggedIn) {
      setFriends([]);
      setFriendRequests([]);
      return;
    }

    loadFriends();
    loadReceivedRequests();
  }, [isLoggedIn]);

  // 게시글 조회는 비로그인 사용자도 가능하므로 로그인 여부와 무관하게 불러온다.
  useEffect(() => {
    loadBoardPosts();
  }, []);

  const handleChangePage = (pageName) => {
    const path = PAGE_PATHS[pageName] || '/';
    navigate(path);
  };

  const handleKakaoLogin = () => {
    const kakaoRestApiKey = import.meta.env.VITE_KAKAO_REST_API_KEY;
    const kakaoRedirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;

    if (!kakaoRestApiKey || !kakaoRedirectUri) {
      alert('카카오 로그인 환경변수가 설정되지 않았습니다.');
      return;
    }

    const kakaoAuthUrl =
      `https://kauth.kakao.com/oauth/authorize` +
      `?client_id=${encodeURIComponent(kakaoRestApiKey)}` +
      `&redirect_uri=${encodeURIComponent(kakaoRedirectUri)}` +
      `&response_type=code`;

    window.location.href = kakaoAuthUrl;
  };

  const handleGoogleLogin = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const googleRedirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

    if (!googleClientId || !googleRedirectUri) {
      alert('구글 로그인 환경변수가 설정되지 않았습니다.');
      return;
    }

    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${encodeURIComponent(googleClientId)}` +
      `&redirect_uri=${encodeURIComponent(googleRedirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent('openid email profile')}`;

    window.location.href = googleAuthUrl;
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate('/');
  };

  const handleLogout = () => {
    const isConfirmed = confirm('로그아웃할까요?');

    if (!isConfirmed) {
      return;
    }

    logout();
    setIsLoggedIn(false);
    setTodoSections([]);
    navigate('/');
  };

  const handleAddCategory = async ({ title, theme }) => {
    if (!requireLogin()) {
      return;
    }

    try {
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
    } catch (error) {
      console.error(error);
      alert(error.message || '카테고리 등록에 실패했습니다.');
    }
  };

  const handleDeleteCategory = async (sectionId) => {
    if (!requireLogin()) {
      return;
    }

    const targetSection = todoSections.find(
      (section) => section.id === sectionId
    );

    if (!targetSection?.categoryId) {
      alert('삭제할 카테고리 정보를 찾을 수 없습니다.');
      return;
    }

    const isConfirmed = confirm('이 카테고리를 삭제할까요?');

    if (!isConfirmed) {
      return;
    }

    try {
      await deleteTodoCategory(targetSection.categoryId);
      await loadCategoriesAndTodos(selectedDate);
      refreshMarkedDates();
    } catch (error) {
      console.error(error);
      alert(error.message || '카테고리 삭제에 실패했습니다.');
    }
  };

  const handleAddTodo = async (sectionId, todoTitle) => {
    if (!requireLogin()) {
      return;
    }

    const targetSection = todoSections.find(
      (section) => section.id === sectionId
    );

    if (!targetSection?.categoryId) {
      alert('카테고리 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      await createTodo({
        categoryId: targetSection.categoryId,
        title: todoTitle,
        content: '',
        todoDate: selectedDate,
        priority: 'MEDIUM',
      });

      await loadCategoriesAndTodos(selectedDate);
      refreshMarkedDates();
    } catch (error) {
      console.error('백엔드 투두 등록 실패:', error);
      alert(error.message || '할 일 등록에 실패했습니다.');
    }
  };

  const handleAddAiTodos = async (selectedTodos, categoryId) => {
    if (!requireLogin()) {
      return;
    }

    if (!categoryId) {
      alert('AI 할 일을 추가할 카테고리를 선택해주세요.');
      return;
    }

    try {
      await Promise.all(
        selectedTodos.map((todoTitle) =>
          createTodo({
            categoryId,
            title: todoTitle,
            content: '',
            todoDate: selectedDate,
            priority: 'MEDIUM',
          })
        )
      );

      await loadCategoriesAndTodos(selectedDate);
      refreshMarkedDates();
    } catch (error) {
      console.error(error);
      alert(error.message || 'AI 할 일 추가에 실패했습니다.');
    }
  };

  const handleToggleTodo = async (sectionId, todoId) => {
    if (!requireLogin()) {
      return;
    }

    const targetSection = todoSections.find(
      (section) => section.id === sectionId
    );

    if (!targetSection) {
      alert('카테고리 정보를 찾을 수 없습니다.');
      return;
    }

    const targetTodo = targetSection.todos.find(
      (todo) => String(todo.id) === String(todoId)
    );

    if (!targetTodo) {
      alert('할 일 정보를 찾을 수 없습니다.');
      return;
    }

    const nextStatus = targetTodo.completed ? 'WAITING' : 'DONE';

    try {
      await updateTodo(targetTodo.todoId || targetTodo.id, {
        categoryId: targetTodo.categoryId,
        title: targetTodo.title,
        content: targetTodo.content || '',
        todoDate: targetTodo.todoDate,
        status: nextStatus,
        priority: targetTodo.priority || 'MEDIUM',
      });

      await loadCategoriesAndTodos(selectedDate);
      refreshMarkedDates();
    } catch (error) {
      console.error('할 일 상태 변경 실패:', error);
      alert(error.message || '할 일 상태 변경에 실패했습니다.');
    }
  };

  const handleDeleteTodo = async (sectionId, todoId) => {
    if (!requireLogin()) {
      return;
    }

    const isConfirmed = confirm('이 할 일을 삭제할까요?');

    if (!isConfirmed) {
      return;
    }

    try {
      await deleteTodo(todoId);
      await loadCategoriesAndTodos(selectedDate);
      refreshMarkedDates();
    } catch (error) {
      console.error(error);
      alert(error.message || '할 일 삭제에 실패했습니다.');
    }
  };

  const handleSearchMembers = async (keyword) => {
    if (!requireLogin()) {
      return [];
    }

    try {
      const result = await searchMembers(keyword);
      return getArrayData(result);
    } catch (error) {
      console.error('회원 검색 실패:', error);
      alert(error.message || '회원 검색에 실패했습니다.');
      return [];
    }
  };

  const handleSendFriendRequest = async (receiverId) => {
    if (!requireLogin()) {
      return;
    }

    try {
      await sendFriendRequest(receiverId);
      alert('친구 요청을 보냈습니다.');
    } catch (error) {
      console.error('친구 요청 전송 실패:', error);
      alert(error.message || '친구 요청 전송에 실패했습니다.');
    }
  };

  const handleAcceptFriendRequest = async (requestId) => {
    if (!requireLogin()) {
      return;
    }

    try {
      await acceptFriendRequest(requestId);
      await Promise.all([loadReceivedRequests(), loadFriends()]);
    } catch (error) {
      console.error('친구 요청 수락 실패:', error);
      alert(error.message || '친구 요청 수락에 실패했습니다.');
    }
  };

  const handleRejectFriendRequest = async (requestId) => {
    if (!requireLogin()) {
      return;
    }

    try {
      await rejectFriendRequest(requestId);
      await loadReceivedRequests();
    } catch (error) {
      console.error('친구 요청 거절 실패:', error);
      alert(error.message || '친구 요청 거절에 실패했습니다.');
    }
  };

  const handleDeleteFriend = async (friendId) => {
    if (!requireLogin()) {
      return;
    }

    const isConfirmed = confirm('이 친구를 삭제할까요?');

    if (!isConfirmed) {
      return;
    }

    try {
      await deleteFriend(friendId);
      await loadFriends();
    } catch (error) {
      console.error('친구 삭제 실패:', error);
      alert(error.message || '친구 삭제에 실패했습니다.');
    }
  };

  const handleAddBoardPost = async ({ title, content, category }) => {
    if (!requireLogin()) {
      return;
    }

    try {
      await createPost({ title, content, category });
      await loadBoardPosts();
    } catch (error) {
      console.error('게시글 등록 실패:', error);
      alert(error.message || '게시글 등록에 실패했습니다.');
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            isLoggedIn={isLoggedIn}
            onChangePage={handleChangePage}
            onLogout={handleLogout}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            calendarYear={calendarYear}
            calendarMonth={calendarMonth}
            markedDates={markedDates}
            onChangeCalendarMonth={handleChangeCalendarMonth}
            todoSections={todoSections}
            onAddTodo={handleAddTodo}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
            onSearchMembers={handleSearchMembers}
            onSendFriendRequest={handleSendFriendRequest}
          />
        }
      />

      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/" replace />
          ) : (
            <LoginPage
              onKakaoLogin={handleKakaoLogin}
              onGoogleLogin={handleGoogleLogin}
            />
          )
        }
      />

      <Route
        path="/auth/kakao/callback"
        element={
          <OAuthCallbackPage
            provider="kakao"
            onLoginSuccess={handleLoginSuccess}
          />
        }
      />

      <Route
        path="/auth/google/callback"
        element={
          <OAuthCallbackPage
            provider="google"
            onLoginSuccess={handleLoginSuccess}
          />
        }
      />

      <Route
        path="/ai-todos"
        element={
          isLoggedIn ? (
            <AiTodoPage
              onChangePage={handleChangePage}
              todoSections={todoSections}
              onAddAiTodos={handleAddAiTodos}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/categories/new"
        element={
          isLoggedIn ? (
            <CategoryCreatePage
              onChangePage={handleChangePage}
              onAddCategory={handleAddCategory}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/categories"
        element={
          isLoggedIn ? (
            <CategoryManagePage
              onChangePage={handleChangePage}
              todoSections={todoSections}
              onDeleteCategory={handleDeleteCategory}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/friends/requests"
        element={
          isLoggedIn ? (
            <FriendRequestPage
              onChangePage={handleChangePage}
              friendRequests={friendRequests}
              friends={friends}
              onAcceptFriendRequest={handleAcceptFriendRequest}
              onRejectFriendRequest={handleRejectFriendRequest}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/friends"
        element={
          isLoggedIn ? (
            <FriendListPage
              onChangePage={handleChangePage}
              friends={friends}
              onDeleteFriend={handleDeleteFriend}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/my"
        element={
          isLoggedIn ? (
            <MyPage
              onChangePage={handleChangePage}
              todoSections={todoSections}
            />
          ) : (
            <Navigate to="/login" replace />
          )
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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;