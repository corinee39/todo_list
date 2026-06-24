import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CalendarCard from "../components/calendar/CalendarCard";
import TimerCard from "../components/timer/TimerCard";
import TodoCardList from "../components/todo/TodoCardList";
import { getFriendTodoDatesByMonth, getFriendTodos } from "../api/friendApi";
import "./HomePage.css";
import "./FriendTodoPage.css";

const CATEGORY_THEMES = ["yellow", "pink", "green", "purple", "blue"];

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function toArray(data) {
  return Array.isArray(data) ? data : [];
}

function groupFriendTodos(items) {
  const sectionMap = new Map();

  items.forEach((item) => {
    const key = item.categoryId ?? "none";

    if (!sectionMap.has(key)) {
      sectionMap.set(key, {
        id: String(key),
        title: item.categoryName || "카테고리 없음",
        todos: [],
      });
    }

    sectionMap.get(key).todos.push({
      id: String(item.todoId),
      title: item.title,
      completed: item.status === "DONE" || Boolean(item.completedAt),
    });
  });

  return Array.from(sectionMap.values()).map((section, index) => ({
    ...section,
    theme: CATEGORY_THEMES[index % CATEGORY_THEMES.length],
  }));
}

function FriendTodoPage({ friends = [], onChangePage }) {
  const { friendId } = useParams();
  const today = getTodayDateString();

  const [selectedDate, setSelectedDate] = useState(today);
  const [calendarYear, setCalendarYear] = useState(Number(today.slice(0, 4)));
  const [calendarMonth, setCalendarMonth] = useState(Number(today.slice(5, 7)));
  const [todoSections, setTodoSections] = useState([]);
  const [markedDates, setMarkedDates] = useState([]);

  const friend = friends.find((item) => String(item.id) === String(friendId));
  const friendName = friend?.name || "친구";

  const loadFriendTodos = async () => {
    try {
      const result = await getFriendTodos(friendId, selectedDate);
      setTodoSections(groupFriendTodos(toArray(result)));
    } catch (error) {
      console.error("친구 할 일 조회 실패:", error);
      setTodoSections([]);
    }
  };

  const loadMarkedDates = async () => {
    try {
      const result = await getFriendTodoDatesByMonth(
        friendId,
        calendarYear,
        calendarMonth
      );
      setMarkedDates(toArray(result).map((date) => String(date).slice(0, 10)));
    } catch (error) {
      console.error("친구 월별 할 일 날짜 조회 실패:", error);
      setMarkedDates([]);
    }
  };

  useEffect(() => {
    loadFriendTodos();
  }, [friendId, selectedDate]);

  useEffect(() => {
    loadMarkedDates();
  }, [friendId, calendarYear, calendarMonth]);

  const handleChangeMonth = (year, month) => {
    setCalendarYear(year);
    setCalendarMonth(month);
  };

  return (
    <main className="home-page">
      <header className="friend-todo-header">
        <button
          className="friend-todo-back"
          onClick={() => onChangePage("home")}
        >
          ←
        </button>

        <div>
          <h1>{friendName}님의 할 일</h1>
          <p>친구의 할 일은 조회만 가능합니다.</p>
        </div>
      </header>

      <section className="dashboard">
        <div className="dashboard-left">
          <TimerCard disabled />

          <CalendarCard
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            viewYear={calendarYear}
            viewMonth={calendarMonth}
            markedDates={markedDates}
            onChangeMonth={handleChangeMonth}
          />
        </div>

        <TodoCardList
          selectedDate={selectedDate}
          todoSections={todoSections}
          readOnly
        />
      </section>
    </main>
  );
}

export default FriendTodoPage;
