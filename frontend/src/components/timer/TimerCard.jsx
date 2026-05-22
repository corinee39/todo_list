import './TimerCard.css';

function TimerCard() {
  return (
    <section className="timer-card">
      <div className="timer-circle">
        <p>25:00</p>
      </div>

      <div className="timer-info">
        <h2>집중 타이머</h2>
        <p>현재 할 일: 정보처리기사 필기 공부</p>

        <div className="timer-mode-list">
          <button className="timer-mode active">집중 25분</button>
          <button className="timer-mode">휴식 5분</button>
        </div>

        <div className="timer-button-list">
          <button className="start-button">시작</button>
          <button>일시정지</button>
          <button>초기화</button>
        </div>
      </div>
    </section>
  );
}

export default TimerCard;