import { useEffect, useState } from 'react';
import './TimerCard.css';

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

function TimerCard() {
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          setIsRunning(false);
          return 0;
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const minute = String(Math.floor(seconds / 60)).padStart(2, '0');
    const second = String(seconds % 60).padStart(2, '0');

    return `${minute}:${second}`;
  };

  const handleFocusMode = () => {
    setMode('focus');
    setTimeLeft(FOCUS_TIME);
    setIsRunning(false);
  };

  const handleBreakMode = () => {
    setMode('break');
    setTimeLeft(BREAK_TIME);
    setIsRunning(false);
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME);
  };

  return (
    <section className="timer-card">
      <div className="timer-circle">
        <p>{formatTime(timeLeft)}</p>
      </div>

      <div className="timer-info">
        <h2>집중 타이머</h2>
        <p>현재 할 일: 정보처리기사 필기 공부</p>

        <div className="timer-mode-list">
          <button
            className={`timer-mode ${mode === 'focus' ? 'active' : ''}`}
            onClick={handleFocusMode}
          >
            집중 25분
          </button>

          <button
            className={`timer-mode ${mode === 'break' ? 'active' : ''}`}
            onClick={handleBreakMode}
          >
            휴식 5분
          </button>
        </div>

        <div className="timer-button-list">
          <button className="start-button" onClick={handleStart}>
            시작
          </button>
          <button onClick={handlePause}>일시정지</button>
          <button onClick={handleReset}>초기화</button>
        </div>
      </div>
    </section>
  );
}

export default TimerCard;