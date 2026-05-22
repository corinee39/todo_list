import './NotificationModal.css';

const NOTIFICATION_TODOS = [
  '과제1 풀이과정 암기, 코딩 연습',
  '파이썬 과제1',
  '냠',
  '캡스톤 구경',
  '유산균, 비타민c',
  '파이썬 스터디 14:30~18:30',
  '하루 5시간 이상 매일 공부하기🙌🏻',
];

function NotificationModal({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="notification-modal-overlay">
      <div className="notification-modal">
        <div className="notification-modal-header">
          <div>
            <h2>알림</h2>
            <p>친구들의 할 일 완료 소식을 확인해보세요.</p>
          </div>

          <button className="notification-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="notification-tab-list">
          <button className="active">친구의 할 일</button>
          <button>친구의 일기</button>
          <button>받은 좋아요</button>
          <button>소식</button>
        </div>

        <section className="notification-feed-card">
          <div className="notification-profile-row">
            <div className="notification-avatar">🐰</div>

            <div className="notification-profile-text">
              <p>
                <strong>모모</strong>님이 <span>7개의 할 일</span>을
                완료했습니다.
              </p>
              <small>4시간 전</small>
            </div>
          </div>

          <div className="notification-timeline">
            {NOTIFICATION_TODOS.map((todo, index) => (
              <div className="notification-todo-row" key={index}>
                <div className="timeline-dot"></div>
                <p>{todo}</p>
                <button>♡</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default NotificationModal;