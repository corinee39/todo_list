import { useState } from 'react';
import CalendarCard from '../components/calendar/CalendarCard';
import FriendAddModal from '../components/friend/FriendAddModal';
import BottomNav from '../components/layout/BottomNav';
import HomeHeader from '../components/layout/HomeHeader';
import NotificationModal from '../components/layout/NotificationModal';
import TimerCard from '../components/timer/TimerCard';
import TodoCardList from '../components/todo/TodoCardList';
import './HomePage.css';

function HomePage({
  isLoggedIn,
  onChangePage,
  onLogout,
  selectedDate,
  onSelectDate,
  todoSections,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
}) {
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isFriendAddModalOpen, setIsFriendAddModalOpen] = useState(false);

  return (
    <main className="home-page">
      <HomeHeader
        isLoggedIn={isLoggedIn}
        onChangePage={onChangePage}
        onLogout={onLogout}
        onOpenFriendAdd={() => setIsFriendAddModalOpen(true)}
      />

      <TimerCard />

      <section className="dashboard">
        <CalendarCard
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
        />

        <TodoCardList
          selectedDate={selectedDate}
          todoSections={todoSections}
          onAddTodo={onAddTodo}
          onToggleTodo={onToggleTodo}
          onDeleteTodo={onDeleteTodo}
        />
      </section>

      <BottomNav
        onChangePage={onChangePage}
        onOpenNotification={() => setIsNotificationModalOpen(true)}
      />

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />

      <FriendAddModal
        isOpen={isFriendAddModalOpen}
        onClose={() => setIsFriendAddModalOpen(false)}
      />
    </main>
  );
}

export default HomePage;