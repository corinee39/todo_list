import CalendarCard from '../components/calendar/CalendarCard';
import BottomNav from '../components/layout/BottomNav';
import HomeHeader from '../components/layout/HomeHeader';
import TimerCard from '../components/timer/TimerCard';
import TodoCardList from '../components/todo/TodoCardList';
import './HomePage.css';

function HomePage() {
  return (
    <main className="home-page">
      <HomeHeader />

      <TimerCard />

      <section className="dashboard">
        <CalendarCard />
        <TodoCardList />
      </section>

      <BottomNav />
    </main>
  );
}

export default HomePage;