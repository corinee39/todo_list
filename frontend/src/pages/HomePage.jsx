import CalendarCard from '../components/calendar/CalendarCard';
import BottomNav from '../components/layout/BottomNav';
import HomeHeader from '../components/layout/HomeHeader';
import TimerCard from '../components/timer/TimerCard';
import TodoCardList from '../components/todo/TodoCardList';
import './HomePage.css';

function HomePage({ onChangePage, todoSections, onAddTodo, onToggleTodo }) {
  return (
    <main className="home-page">
      <HomeHeader onChangePage={onChangePage} />

      <TimerCard />

      <section className="dashboard">
        <CalendarCard />

        <TodoCardList
          todoSections={todoSections}
          onAddTodo={onAddTodo}
          onToggleTodo={onToggleTodo}
        />
      </section>

      <BottomNav />
    </main>
  );
}

export default HomePage;