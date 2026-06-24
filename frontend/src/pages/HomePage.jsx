import { useState } from 'react';
import CalendarCard from '../components/calendar/CalendarCard';
import FriendAddModal from '../components/friend/FriendAddModal';
import HomeHeader from '../components/layout/HomeHeader';
import TimerCard from '../components/timer/TimerCard';
import TodoCardList from '../components/todo/TodoCardList';
import './HomePage.css';

function HomePage({
  isLoggedIn,
  onChangePage,
  onLogout,
  currentUser,
  friends,
  selectedDate,
  onSelectDate,
  calendarYear,
  calendarMonth,
  markedDates,
  onChangeCalendarMonth,
  todoSections,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onSearchMembers,
  onSendFriendRequest,
  onOpenFriendTodos,
}) {
  const [isFriendAddModalOpen, setIsFriendAddModalOpen] = useState(false);

  return (
    <main className="home-page">
      <HomeHeader
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        friends={friends}
        onChangePage={onChangePage}
        onLogout={onLogout}
        onOpenFriendAdd={() => setIsFriendAddModalOpen(true)}
        onOpenFriendTodos={onOpenFriendTodos}
      />

      <section className="dashboard">
        <div className="dashboard-left">
          <TimerCard />

          <CalendarCard
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            viewYear={calendarYear}
            viewMonth={calendarMonth}
            markedDates={markedDates}
            onChangeMonth={onChangeCalendarMonth}
          />
        </div>

        <TodoCardList
          selectedDate={selectedDate}
          todoSections={todoSections}
          onAddTodo={onAddTodo}
          onToggleTodo={onToggleTodo}
          onDeleteTodo={onDeleteTodo}
        />
      </section>

      <FriendAddModal
        isOpen={isFriendAddModalOpen}
        onClose={() => setIsFriendAddModalOpen(false)}
        onSearchMembers={onSearchMembers}
        onSendFriendRequest={onSendFriendRequest}
      />
    </main>
  );
}

export default HomePage;
