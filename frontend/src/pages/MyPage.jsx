import './MyPage.css';

function MyPage({ onChangePage, todoSections }) {
  const allTodos = todoSections.flatMap((section) => section.todos);
  const completedTodos = allTodos.filter((todo) => todo.completed);

  return (
    <main className="my-page">
      <div className="my-page-container">
        <header className="my-page-header">
          <button className="my-back-button" onClick={() => onChangePage('home')}>
            ←
          </button>

          <button className="my-setting-button" aria-label="설정">
            ⚙
          </button>
        </header>

        <section className="my-profile-section">
          <div className="my-profile-avatar">🐰</div>

          <div className="my-profile-info">
            <h1>me</h1>
            <p>momo.planer@example.com</p>
            <div className="my-follow-info">
              <span>팔로잉 1</span>
              <span>팔로워 0</span>
            </div>
          </div>
        </section>

        <section className="my-record-card">
          <div className="record-icon">📊</div>
          <div>
            <h2>나의 기록</h2>
            <p>오늘 완료한 할 일 {completedTodos.length}개</p>
          </div>
        </section>

        <section className="today-done-card">
          <div className="today-done-title-row">
            <h2>오늘 한 일</h2>
            <span>{completedTodos.length}개 완료</span>
          </div>

          <div className="today-done-list">
            {completedTodos.length === 0 ? (
              <p className="empty-today-message">
                아직 완료한 할 일이 없습니다.
              </p>
            ) : (
              completedTodos.map((todo) => (
                <div className="today-done-item" key={todo.id}>
                  <span className="today-check">✓</span>
                  <p>{todo.title}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default MyPage;