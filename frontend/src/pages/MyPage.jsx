import { useEffect, useState } from 'react';
import './MyPage.css';

function getAvatarText(name) {
  if (name && name.trim()) {
    return name.trim().charAt(0);
  }

  return '?';
}

const PROVIDER_LABELS = {
  kakao: '카카오',
  google: '구글',
};

function MyPage({
  onChangePage,
  currentUser,
  todoSections,
  onUpdateNickname,
  onDeleteAccount,
}) {
  const [nickname, setNickname] = useState(currentUser?.nickname || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setNickname(currentUser?.nickname || '');
  }, [currentUser]);

  const allTodos = todoSections.flatMap((section) => section.todos);
  const completedTodos = allTodos.filter((todo) => todo.completed);

  const providerLabel =
    PROVIDER_LABELS[currentUser?.provider] || currentUser?.provider || '';

  const handleSaveNickname = async (event) => {
    event.preventDefault();

    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    if (trimmedNickname === currentUser?.nickname) {
      alert('기존 닉네임과 동일합니다.');
      return;
    }

    setIsSaving(true);

    try {
      await onUpdateNickname(trimmedNickname);
      alert('닉네임이 변경되었습니다.');
    } catch (error) {
      alert(error.message || '닉네임 변경에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const isConfirmed = confirm(
      '정말 회원 탈퇴하시겠어요? 이 작업은 되돌릴 수 없습니다.'
    );

    if (!isConfirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDeleteAccount();
    } catch (error) {
      alert(error.message || '회원 탈퇴에 실패했습니다.');
      setIsDeleting(false);
    }
  };

  return (
    <main className="my-page">
      <div className="my-page-container">
        <header className="my-page-header">
          <button
            className="my-back-button"
            onClick={() => onChangePage('home')}
          >
            ←
          </button>
        </header>

        <section className="my-profile-section">
          <div className="my-profile-avatar">
            {getAvatarText(currentUser?.nickname)}
          </div>

          <div className="my-profile-info">
            <h1>{currentUser?.nickname || '사용자'}</h1>
            <p>{currentUser?.email}</p>
            {providerLabel && (
              <span className="my-provider-badge">{providerLabel} 로그인</span>
            )}
          </div>
        </section>

        <section className="my-edit-card">
          <h2>닉네임 수정</h2>

          <form className="my-edit-form" onSubmit={handleSaveNickname}>
            <input
              type="text"
              value={nickname}
              maxLength={50}
              placeholder="새 닉네임"
              onChange={(event) => setNickname(event.target.value)}
            />
            <button type="submit" disabled={isSaving}>
              {isSaving ? '저장 중...' : '저장'}
            </button>
          </form>
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

        <section className="my-danger-card">
          <div>
            <h2>회원 탈퇴</h2>
            <p>탈퇴하면 계정과 데이터를 더 이상 사용할 수 없습니다.</p>
          </div>

          <button
            type="button"
            className="my-delete-button"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? '처리 중...' : '회원 탈퇴'}
          </button>
        </section>
      </div>
    </main>
  );
}

export default MyPage;
