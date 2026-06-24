import './CalendarCard.css';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function pad2(value) {
  return String(value).padStart(2, '0');
}

function getTodayDateString() {
  const now = new Date();
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(
    now.getDate()
  )}`;
}

function CalendarCard({
  selectedDate,
  onSelectDate,
  viewYear,
  viewMonth,
  markedDates = [],
  onChangeMonth,
}) {
  const todayString = getTodayDateString();
  const markedDateSet = new Set(markedDates);

  // 1일이 무슨 요일인지 (0=일 ~ 6=토) → 앞쪽 빈 칸 개수
  const firstDayOfWeek = new Date(viewYear, viewMonth - 1, 1).getDay();
  // 해당 월의 마지막 날짜
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarCells = [];

  for (let i = 0; i < firstDayOfWeek; i += 1) {
    calendarCells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    calendarCells.push(day);
  }

  const getDateValue = (day) =>
    `${viewYear}-${pad2(viewMonth)}-${pad2(day)}`;

  const getDayClassName = (day, index) => {
    const classNames = [];
    const dateValue = getDateValue(day);
    const dayOfWeek = index % 7;

    if (dateValue === selectedDate) {
      classNames.push('selected');
    }

    if (dateValue === todayString) {
      classNames.push('today');
    }

    if (markedDateSet.has(dateValue)) {
      classNames.push('has-todo');
    }

    if (dayOfWeek === 6) {
      classNames.push('saturday');
    }

    if (dayOfWeek === 0) {
      classNames.push('sunday');
    }

    return classNames.join(' ');
  };

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      onChangeMonth(viewYear - 1, 12);
      return;
    }

    onChangeMonth(viewYear, viewMonth - 1);
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      onChangeMonth(viewYear + 1, 1);
      return;
    }

    onChangeMonth(viewYear, viewMonth + 1);
  };

  return (
    <div className="calendar-card">
      <div className="calendar-title-row">
        <button
          type="button"
          className="calendar-arrow"
          onClick={handlePrevMonth}
          aria-label="이전 달"
        >
          ‹
        </button>

        <h2>
          {viewYear}년 {viewMonth}월
        </h2>

        <button
          type="button"
          className="calendar-arrow"
          onClick={handleNextMonth}
          aria-label="다음 달"
        >
          ›
        </button>
      </div>

      <div className="calendar-weekdays">
        {WEEKDAY_LABELS.map((label, index) => (
          <span
            key={label}
            className={
              index === 0 ? 'sunday' : index === 6 ? 'saturday' : undefined
            }
          >
            {label}
          </span>
        ))}
      </div>

      <div className="calendar-grid">
        {calendarCells.map((day, index) => {
          if (!day) {
            return <span key={`empty-${index}`}></span>;
          }

          return (
            <button
              type="button"
              className={getDayClassName(day, index)}
              key={day}
              onClick={() => onSelectDate(getDateValue(day))}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarCard;
