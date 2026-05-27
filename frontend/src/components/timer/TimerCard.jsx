import { useEffect, useState } from 'react';
import './TimerCard.css';

const DEFAULT_MINUTES = 25;
const DEFAULT_SECONDS = 0;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0'
  )}`;
}

function TimerCard() {
  const [inputMinutes, setInputMinutes] = useState(DEFAULT_MINUTES);
  const [inputSeconds, setInputSeconds] = useState(DEFAULT_SECONDS);
  const [totalSeconds, setTotalSeconds] = useState(
    DEFAULT_MINUTES * 60 + DEFAULT_SECONDS
  );
  const [remainingSeconds, setRemainingSeconds] = useState(
    DEFAULT_MINUTES * 60 + DEFAULT_SECONDS
  );
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timerId = setInterval(() => {
      setRemainingSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(timerId);
          setIsRunning(false);
          return 0;
        }

        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRunning]);

  const handleApplyTime = () => {
    const minutes = Number(inputMinutes);
    const seconds = Number(inputSeconds);

    if (minutes < 0 || seconds < 0 || seconds > 59) {
      alert('시간을 올바르게 입력해주세요.');
      return;
    }

    const nextTotalSeconds = minutes * 60 + seconds;

    if (nextTotalSeconds <= 0) {
      alert('1초 이상 입력해주세요.');
      return;
    }

    setIsRunning(false);
    setTotalSeconds(nextTotalSeconds);
    setRemainingSeconds(nextTotalSeconds);
  };

  const handleStart = () => {
    if (remainingSeconds <= 0) {
      handleApplyTime();
      return;
    }

    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
  };

  const progressPercent =
    totalSeconds > 0
      ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100
      : 0;

  return (
    <section className="timer-card">
      <div
        className="timer-circle"
        style={{
          background: `conic-gradient(#7b61ff ${progressPercent}%, #ded7ff ${progressPercent}%)`,
        }}
      >
        <div className="timer-circle-inner">
          <strong>{formatTime(remainingSeconds)}</strong>
        </div>
      </div>

      <div className="timer-content">
        <h2>집중 타이머</h2>

        <div className="timer-setting">
          <label>
            <span>분</span>
            <input
              type="number"
              min="0"
              value={inputMinutes}
              disabled={isRunning}
              onChange={(event) => setInputMinutes(event.target.value)}
            />
          </label>

          <label>
            <span>초</span>
            <input
              type="number"
              min="0"
              max="59"
              value={inputSeconds}
              disabled={isRunning}
              onChange={(event) => setInputSeconds(event.target.value)}
            />
          </label>

          <button type="button" disabled={isRunning} onClick={handleApplyTime}>
            적용
          </button>
        </div>

        <div className="timer-actions">
          {isRunning ? (
            <button type="button" onClick={handlePause}>
              일시정지
            </button>
          ) : (
            <button type="button" onClick={handleStart}>
              시작
            </button>
          )}

          <button type="button" onClick={handleReset}>
            초기화
          </button>
        </div>
      </div>
    </section>
  );
}

export default TimerCard;