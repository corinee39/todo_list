import './FriendListPage.css';

function FriendListPage({ onChangePage, friends, onDeleteFriend }) {
  return (
    <main className="friend-list-page">
      <div className="friend-list-container">
        <header className="friend-list-header">
          <button
            className="friend-back-button"
            onClick={() => onChangePage('home')}
          >
            ←
          </button>

          <div>
            <h1>친구 목록</h1>
            <p>함께 공부하는 친구들의 상태를 확인해보세요.</p>
          </div>
        </header>

        <section className="friend-list-card">
          <div className="friend-list-title-row">
            <h2>내 친구</h2>
            <span>{friends.length}명</span>
          </div>

          <div className="friend-list-content">
            {friends.length === 0 ? (
              <p className="friend-empty-message">
                아직 등록된 친구가 없습니다.
              </p>
            ) : (
              friends.map((friend) => (
                <article className="friend-list-item" key={friend.id}>
                  <div className="friend-list-avatar">{friend.avatar}</div>

                  <div className="friend-list-info">
                    <strong>{friend.name}</strong>
                    <p>{friend.message}</p>
                  </div>

                  <button
                    className="friend-delete-button"
                    onClick={() => onDeleteFriend(friend.id)}
                  >
                    삭제
                  </button>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default FriendListPage;