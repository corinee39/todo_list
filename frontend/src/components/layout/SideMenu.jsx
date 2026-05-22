import './SideMenu.css';

function SideMenu({ isOpen, onClose, onChangePage }) {
  const handleMoveAiTodoPage = () => {
    onChangePage('aiTodo');
    onClose();
  };

  return (
    <div className={`side-menu-overlay ${isOpen ? 'open' : ''}`}>
      <aside className="side-menu">
        <div className="side-menu-header">
          <h2>메뉴</h2>
          <button className="side-menu-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="side-menu-profile">
          <div className="side-menu-avatar">me</div>
          <div>
            <strong>me</strong>
            <p>오늘도 하나씩 해보자</p>
          </div>
        </div>

        <nav className="side-menu-list">
          <div className="side-menu-section">
            <p className="side-menu-section-title">카테고리</p>
            <button>＋ 카테고리 등록</button>
            <button>⚙ 카테고리 관리</button>
          </div>

          <div className="side-menu-section">
            <p className="side-menu-section-title">친구</p>
            <button>👥 친구 요청</button>
            <button>🙂 친구 목록</button>
          </div>

          <div className="side-menu-section">
            <p className="side-menu-section-title">기능</p>
            <button onClick={handleMoveAiTodoPage}>🤖 AI 할 일 생성</button>
            <button>📝 게시판</button>
          </div>

          <div className="side-menu-section">
            <p className="side-menu-section-title">기타</p>
            <button className="logout-button">로그아웃</button>
          </div>
        </nav>
      </aside>
    </div>
  );
}

export default SideMenu;