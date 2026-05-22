import CalendarCard from '../components/calendar/CalendarCard';
import TimerCard from '../components/timer/TimerCard';
import TodoCardList from '../components/todo/TodoCardList';
import './HomePage.css';

function HomePage() {
  return (
    <main className="home-page">
      <header className="home-header">
        <div className="friend-list">
          <button className="profile-chip active">
            <span className="avatar">me</span>
            <span>me</span>
          </button>

          <button className="profile-chip">
            <span className="avatar animal">🐰</span>
            <span>모모</span>
          </button>

          <button className="profile-chip">
            <span className="avatar animal">🐻</span>
            <span>하니</span>
          </button>

          <button className="friend-add-button">＋</button>
        </div>

        <button className="menu-button" aria-label="메뉴 열기">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      <TimerCard />

      <section className="dashboard">
        <CalendarCard />
        <TodoCardList />
      </section>
    </main>
  );
}

export default HomePage;