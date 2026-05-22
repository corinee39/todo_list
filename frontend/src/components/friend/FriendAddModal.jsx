import { useState } from 'react';
import './FriendAddModal.css';

function FriendAddModal({ isOpen, onClose }) {
  const [friendId, setFriendId] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!friendId.trim()) {
      alert('친구 아이디 또는 이메일을 입력해주세요.');
      return;
    }

    alert(`${friendId}님에게 친구 요청을 보냈습니다.`);
    setFriendId('');
    onClose();
  };

  return (
    <div className="friend-add-modal-overlay">
      <div className="friend-add-modal">
        <div className="friend-add-modal-header">
          <div>
            <h2>친구 추가</h2>
            <p>아이디나 이메일로 친구를 찾아 요청을 보낼 수 있어요.</p>
          </div>

          <button className="friend-add-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="friend-add-form" onSubmit={handleSubmit}>
          <label>
            <span>친구 아이디 또는 이메일</span>
            <input
              type="text"
              value={friendId}
              placeholder="예: momo@example.com"
              onChange={(event) => setFriendId(event.target.value)}
            />
          </label>

          <button type="submit">친구 요청 보내기</button>
        </form>

        <section className="friend-recommend-card">
          <h3>추천 친구</h3>

          <div className="friend-recommend-list">
            <div className="friend-recommend-item">
              <div className="friend-recommend-avatar">🐰</div>
              <div>
                <strong>모모</strong>
                <p>정보처리기사 공부 중</p>
              </div>
              <button>요청</button>
            </div>

            <div className="friend-recommend-item">
              <div className="friend-recommend-avatar">🐻</div>
              <div>
                <strong>하니</strong>
                <p>오늘 뽀모도로 2세트 완료</p>
              </div>
              <button>요청</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default FriendAddModal;