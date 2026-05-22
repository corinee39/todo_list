import TimerCard from '../components/timer/TimerCard';
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
        <div className="calendar-card">
          <div className="calendar-title-row">
            <h2>2026년 5월</h2>
            <button className="calendar-arrow">⌄</button>
          </div>

          <div className="calendar-weekdays">
            <span>월</span>
            <span>화</span>
            <span>수</span>
            <span>목</span>
            <span>금</span>
            <span className="saturday">토</span>
            <span className="sunday">일</span>
          </div>

          <div className="calendar-grid">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <button className="selected">1</button>
            <button className="saturday">2</button>
            <button className="sunday">3</button>

            <button>4</button>
            <button>5</button>
            <button>6</button>
            <button>7</button>
            <button>8</button>
            <button className="saturday">9</button>
            <button className="sunday">10</button>

            <button>11</button>
            <button>12</button>
            <button>13</button>
            <button>14</button>
            <button>15</button>
            <button className="saturday">16</button>
            <button className="sunday">17</button>

            <button>18</button>
            <button>19</button>
            <button>20</button>
            <button>21</button>
            <button className="today">22</button>
            <button className="saturday">23</button>
            <button className="sunday">24</button>

            <button>25</button>
            <button>26</button>
            <button>27</button>
            <button>28</button>
            <button>29</button>
            <button className="saturday">30</button>
            <button className="sunday">31</button>
          </div>
        </div>

        <div className="todo-card-list">
          <article className="todo-card pink">
            <h3>나를 사랑하고 돌보기</h3>
            <p>○ 아침명상 / 기도 / 스트레칭</p>
            <p>○ 유산균, 비타민C</p>
          </article>

          <article className="todo-card yellow">
            <h3>공부</h3>
            <p>○ 정보처리기사 필기 기출 풀이</p>
            <p>○ 오답노트 정리하기</p>
          </article>

          <article className="todo-card green">
            <h3>대화와 준비</h3>
            <p>○ 수험표, 신분증 챙기기</p>
            <p>○ 스터디 참여하기</p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default HomePage;