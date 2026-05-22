import { useState } from 'react';
import './BoardPage.css';

function BoardPage({ onChangePage, boardPosts, onAddBoardPost }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmitPost = (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    onAddBoardPost({
      title: trimmedTitle,
      content: trimmedContent,
    });

    setTitle('');
    setContent('');
  };

  return (
    <main className="board-page">
      <div className="board-container">
        <header className="board-header">
          <button className="board-back-button" onClick={() => onChangePage('home')}>
            ←
          </button>

          <div>
            <h1>게시판</h1>
            <p>공부 기록이나 프로젝트 진행 상황을 간단히 공유해보세요.</p>
          </div>
        </header>

        <form className="board-write-card" onSubmit={handleSubmitPost}>
          <h2>게시글 작성</h2>

          <input
            type="text"
            value={title}
            placeholder="제목을 입력하세요"
            onChange={(event) => setTitle(event.target.value)}
          />

          <textarea
            value={content}
            placeholder="내용을 입력하세요"
            onChange={(event) => setContent(event.target.value)}
          />

          <button type="submit">등록</button>
        </form>

        <section className="board-list-card">
          <div className="board-list-title-row">
            <h2>게시글 목록</h2>
            <span>{boardPosts.length}개</span>
          </div>

          <div className="board-post-list">
            {boardPosts.map((post) => (
              <article className="board-post-item" key={post.id}>
                <div>
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                </div>

                <span className="board-post-date">{post.createdAt}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default BoardPage;