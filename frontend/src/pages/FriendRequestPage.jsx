import './FriendRequestPage.css';

function FriendRequestPage({
  onChangePage,
  friendRequests,
  friends,
  onAcceptFriendRequest,
  onRejectFriendRequest,
}) {
  return (
    <main className="friend-request-page">
      <div className="friend-request-container">
        <header className="friend-request-header">
          <button
            className="friend-back-button"
            onClick={() => onChangePage('home')}
          >
            ←
          </button>

          <div>
            <h1>친구 요청</h1>
            <p>받은 친구 요청을 수락하거나 거절할 수 있어요.</p>
          </div>
        </header>

        <section className="friend-request-card">
          <div className="friend-request-title-row">
            <h2>받은 요청</h2>
            <span>{friendRequests.length}개</span>
          </div>

          <div className="friend-request-list">
            {friendRequests.length === 0 ? (
              <p className="empty-message">받은 친구 요청이 없습니다.</p>
            ) : (
              friendRequests.map((request) => (
                <article className="friend-request-item" key={request.id}>
                  <div className="friend-avatar">{request.avatar}</div>

                  <div className="friend-info">
                    <strong>{request.name}</strong>
                    <p>{request.message}</p>
                  </div>

                  <div className="friend-action-list">
                    <button
                      className="accept-button"
                      onClick={() => onAcceptFriendRequest(request.id)}
                    >
                      수락
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => onRejectFriendRequest(request.id)}
                    >
                      거절
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="friend-request-card">
          <div className="friend-request-title-row">
            <h2>내 친구</h2>
            <span>{friends.length}명</span>
          </div>

          <div className="friend-request-list">
            {friends.length === 0 ? (
              <p className="empty-message">아직 등록된 친구가 없습니다.</p>
            ) : (
              friends.map((friend) => (
                <article className="friend-request-item" key={friend.id}>
                  <div className="friend-avatar">{friend.avatar}</div>

                  <div className="friend-info">
                    <strong>{friend.name}</strong>
                    <p>{friend.message}</p>
                  </div>

                  <span className="friend-status">친구</span>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default FriendRequestPage;