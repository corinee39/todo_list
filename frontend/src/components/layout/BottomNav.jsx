import './BottomNav.css';

function BottomNav({ onChangePage, onOpenNotification }) {
  return (
    <nav className="bottom-nav">
      <button
        className="bottom-nav-item active"
        onClick={() => onChangePage('home')}
      >
        <span className="bottom-nav-icon">⌂</span>
        <span>홈</span>
      </button>

      <button className="bottom-nav-item">
        <span className="bottom-nav-icon">⌕</span>
        <span>탐색</span>
      </button>

      <button className="bottom-nav-item" onClick={onOpenNotification}>
        <span className="bottom-nav-icon">♧</span>
        <span>알림</span>
      </button>

      <button
        className="bottom-nav-item"
        onClick={() => onChangePage('friendList')}
      >
        <span className="bottom-nav-icon">✈</span>
        <span>친구</span>
      </button>

      <button
        className="bottom-nav-item"
        onClick={() => onChangePage('myPage')}
      >
        <span className="bottom-nav-icon">○</span>
        <span>마이페이지</span>
      </button>
    </nav>
  );
}

export default BottomNav;