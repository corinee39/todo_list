import './SideMenu.css';

function SideMenu({ isOpen, isLoggedIn, onClose, onChangePage, onLogout }) {
  const movePage = (pageName) => {
    onChangePage(pageName);
    onClose();
  };

  const moveProtectedPage = (pageName) => {
    if (!isLoggedIn) {
      onChangePage('login');
      onClose();
      return;
    }

    onChangePage(pageName);
    onClose();
  };

  const handleLogout = () => {
    onClose();
    onLogout();
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
            <p>
              {isLoggedIn
                ? '로그인 상태입니다.'
                : '로그인 없이 둘러보는 중입니다.'}
            </p>
          </div>
        </div>

        <nav className="side-menu-list">
          <div className="side-menu-section">
            <p className="side-menu-section-title">카테고리</p>
            <button onClick={() => moveProtectedPage('categoryCreate')}>
              ＋ 카테고리 등록
            </button>
            <button onClick={() => moveProtectedPage('categoryManage')}>
              ⚙ 카테고리 관리
            </button>
          </div>

          <div className="side-menu-section">
            <p className="side-menu-section-title">친구</p>
            <button onClick={() => moveProtectedPage('friendRequest')}>
              👥 친구 요청
            </button>
            <button onClick={() => moveProtectedPage('friendList')}>
              🙂 친구 목록
            </button>
          </div>

          <div className="side-menu-section">
            <p className="side-menu-section-title">기능</p>
            <button onClick={() => moveProtectedPage('aiTodo')}>
              🤖 AI 할 일 생성
            </button>
            <button onClick={() => movePage('board')}>📝 게시판</button>
          </div>

          <div className="side-menu-section">
            <p className="side-menu-section-title">계정</p>

            {isLoggedIn ? (
              <button className="logout-button" onClick={handleLogout}>
                로그아웃
              </button>
            ) : (
              <button onClick={() => movePage('login')}>로그인</button>
            )}
          </div>
        </nav>
      </aside>
    </div>
  );
}

export default SideMenu;