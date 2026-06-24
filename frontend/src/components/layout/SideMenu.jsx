import "./SideMenu.css";

function getAvatarText(name) {
  if (name && name.trim()) {
    return name.trim().charAt(0);
  }

  return "?";
}

function SideMenu({
  isOpen,
  isLoggedIn,
  nickname = "게스트",
  onClose,
  onChangePage,
  onLogout,
}) {
  const movePage = (pageName) => {
    onChangePage(pageName);
    onClose();
  };

  const moveProtectedPage = (pageName) => {
    if (!isLoggedIn) {
      onChangePage("login");
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
    <div className={`side-menu-overlay ${isOpen ? "open" : ""}`}>
      <aside className="side-menu">
        <div className="side-menu-header">
          <h2>메뉴</h2>
          <button className="side-menu-close" onClick={onClose}>
            ×
          </button>
        </div>

        <button
          type="button"
          className="side-menu-profile"
          onClick={() => moveProtectedPage('myPage')}
        >
          <div className="side-menu-avatar">{getAvatarText(nickname)}</div>
          <div className="side-menu-profile-text">
            <strong>{nickname}</strong>
            <p>
              {isLoggedIn
                ? '내 정보 보기 / 닉네임 수정'
                : '로그인하고 내 정보를 관리하세요.'}
            </p>
          </div>
        </button>

        <nav className="side-menu-list">
          <div className="side-menu-section">
            <p className="side-menu-section-title">카테고리</p>
            <button onClick={() => moveProtectedPage("categoryCreate")}>
              ＋ 카테고리 등록
            </button>
            <button onClick={() => moveProtectedPage("categoryManage")}>
              ⚙ 카테고리 관리
            </button>
          </div>

          <div className="side-menu-section">
            <p className="side-menu-section-title">친구</p>
            <button onClick={() => moveProtectedPage("friendRequest")}>
              👥 친구 요청
            </button>
            <button onClick={() => moveProtectedPage("friendList")}>
              🙂 친구 목록
            </button>
          </div>

          <div className="side-menu-section">
            <p className="side-menu-section-title">기능</p>
            <button onClick={() => moveProtectedPage("aiTodo")}>
              🤖 AI 할 일 생성
            </button>
            <button onClick={() => movePage("board")}>📝 게시판</button>
          </div>

          <div className="side-menu-section">
            <p className="side-menu-section-title">계정</p>

            {isLoggedIn ? (
              <button className="logout-button" onClick={handleLogout}>
                로그아웃
              </button>
            ) : (
              <button onClick={() => movePage("login")}>로그인</button>
            )}
          </div>
        </nav>
      </aside>
    </div>
  );
}

export default SideMenu;
