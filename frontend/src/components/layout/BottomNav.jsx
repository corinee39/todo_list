import './BottomNav.css';

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <button className="bottom-nav-item active">
        <span className="bottom-nav-icon">⌂</span>
        <span>홈</span>
      </button>

      <button className="bottom-nav-item">
        <span className="bottom-nav-icon">⌕</span>
        <span>탐색</span>
      </button>

      <button className="bottom-nav-item">
        <span className="bottom-nav-icon">♧</span>
        <span>알림</span>
      </button>

      <button className="bottom-nav-item">
        <span className="bottom-nav-icon">✈</span>
        <span>친구</span>
      </button>

      <button className="bottom-nav-item">
        <span className="bottom-nav-icon">○</span>
        <span>마이페이지</span>
      </button>
    </nav>
  );
}

export default BottomNav;