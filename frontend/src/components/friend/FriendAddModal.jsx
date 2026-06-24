import { useState } from 'react';
import './FriendAddModal.css';

function getAvatarText(nickname) {
  if (nickname && nickname.trim()) {
    return nickname.trim().charAt(0);
  }

  return '🙂';
}

function FriendAddModal({
  isOpen,
  onClose,
  onSearchMembers,
  onSendFriendRequest,
}) {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    setKeyword('');
    setSearchResults([]);
    setHasSearched(false);
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      alert('아이디(닉네임) 또는 이메일을 입력해주세요.');
      return;
    }

    setIsSearching(true);

    try {
      const results = await onSearchMembers(trimmedKeyword);
      setSearchResults(results || []);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async (receiverId) => {
    await onSendFriendRequest(receiverId);
  };

  return (
    <div className="friend-add-modal-overlay">
      <div className="friend-add-modal">
        <div className="friend-add-modal-header">
          <div>
            <h2>친구 추가</h2>
            <p>닉네임이나 이메일로 친구를 찾아 요청을 보낼 수 있어요.</p>
          </div>

          <button className="friend-add-modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <form className="friend-add-form" onSubmit={handleSubmit}>
          <label>
            <span>친구 닉네임 또는 이메일</span>
            <input
              type="text"
              value={keyword}
              placeholder="예: momo 또는 momo@example.com"
              onChange={(event) => setKeyword(event.target.value)}
            />
          </label>

          <button type="submit" disabled={isSearching}>
            {isSearching ? '검색 중...' : '검색'}
          </button>
        </form>

        <section className="friend-recommend-card">
          <h3>검색 결과</h3>

          <div className="friend-recommend-list">
            {!hasSearched ? (
              <p className="friend-recommend-empty">
                닉네임이나 이메일로 친구를 검색해보세요.
              </p>
            ) : searchResults.length === 0 ? (
              <p className="friend-recommend-empty">검색 결과가 없습니다.</p>
            ) : (
              searchResults.map((member) => (
                <div className="friend-recommend-item" key={member.userId}>
                  <div className="friend-recommend-avatar">
                    {getAvatarText(member.nickname)}
                  </div>
                  <div>
                    <strong>{member.nickname}</strong>
                    <p>{member.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSendRequest(member.userId)}
                  >
                    요청
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default FriendAddModal;
