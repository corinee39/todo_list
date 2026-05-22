import './CalendarCard.css';

const CALENDAR_DAYS = [
  null,
  null,
  null,
  null,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
];

function CalendarCard({ selectedDate, onSelectDate }) {
  const getDateValue = (day) => `2026-05-${String(day).padStart(2, '0')}`;

  const getDayClassName = (day, index) => {
    const classNames = [];

    const dateValue = getDateValue(day);
    const dayOfWeek = index % 7;

    if (dateValue === selectedDate) {
      classNames.push('selected');
    }

    if (day === 22) {
      classNames.push('today');
    }

    if (dayOfWeek === 5) {
      classNames.push('saturday');
    }

    if (dayOfWeek === 6) {
      classNames.push('sunday');
    }

    return classNames.join(' ');
  };

  return (
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
        {CALENDAR_DAYS.map((day, index) => {
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