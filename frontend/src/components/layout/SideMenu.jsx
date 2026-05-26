import "./SideMenu.css";

function SideMenu({ isOpen, onClose, onChangePage, onLogout, member }) {
  const nickname = member?.nickname || "me";

  const handleMoveAiTodoPage = () => {
    onChangePage("aiTodo");
    onClose();
  };

  const handleMoveCategoryCreatePage = () => {
    onChangePage("categoryCreate");
    onClose();
  };

  const handleMoveCategoryManagePage = () => {
    onChangePage("categoryManage");
    onClose();
  };

  const handleMoveFriendRequestPage = () => {
    onChangePage("friendRequest");
    onClose();
  };

  const handleMoveFriendListPage = () => {
    onChangePage("friendList");
    onClose();
  };

  const handleMoveBoardPage = () => {
    onChangePage("board");
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

        <div className="side-menu-profile">
          <div className="side-menu-avatar">me</div>
          <div>
            <strong>{nickname}</strong>
            <p>오늘도 하나씩 해보자</p>
          </div>
        </div>

        <nav className="side-menu-list">
          <div className="side-menu-section">
            <p className="side-menu-section-title">카테고리</p>
            <button onClick={handleMoveCategoryCreatePage}>
              ＋ 카테고리 등록
            </button>
            <button onClick={handleMoveCategoryManagePage}>
              ⚙ 카테고리 관리
            </button>
          </div>

          <div className="side-menu-section">
            <p className="side-menu-section-title">친구</p>
            <button onClick={handleMoveFriendRequestPage}>👥 친구 요청</button>
            <button onClick={handleMoveFriendListPage}>🙂 친구 목록</button>
          </div>

          <div className="side-menu-section">
            <p className="side-menu-section-title">기능</p>
            <button onClick={handleMoveAiTodoPage}>🤖 AI 할 일 생성</button>
            <button onClick={handleMoveBoardPage}>📝 게시판</button>
          </div>

          <div className="side-menu-section">
            <p className="side-menu-section-title">기타</p>
            <button className="logout-button" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </nav>
      </aside>
    </div>
  );
}

export default SideMenu;
