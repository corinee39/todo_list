import { useMemo, useState } from 'react';
import './BoardPage.css';

const BOARD_FILTERS = ['전체', '공지', '질문', '공유', '자유'];

function getPostCategory(post) {
  if (post.category) {
    return post.category;
  }

  if (post.title.includes('정보처리기사')) {
    return '질문';
  }

  if (post.title.includes('AI')) {
    return '공유';
  }

  return '자유';
}

function BoardPage({ onChangePage, boardPosts, onAddBoardPost }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [keyword, setKeyword] = useState('');

  const filteredPosts = useMemo(() => {
    return boardPosts.filter((post) => {
      const postCategory = getPostCategory(post);
      const matchesCategory =
        selectedFilter === '전체' || postCategory === selectedFilter;

      const searchText = `${post.title} ${post.content}`.toLowerCase();
      const matchesKeyword = searchText.includes(keyword.toLowerCase());

      return matchesCategory && matchesKeyword;
    });
  }, [boardPosts, selectedFilter, keyword]);

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
          <button
            className="board-back-button"
            onClick={() => onChangePage('home')}
          >
            ←
          </button>

          <div>
            <h1>게시판</h1>
            <p>질문이나 공부 기록을 간단히 남겨보세요.</p>
          </div>
        </header>

        <section className="board-write-section">
          <h2>글쓰기</h2>

          <form className="board-write-form" onSubmit={handleSubmitPost}>
            <input
              type="text"
              value={title}
              placeholder="제목"
              onChange={(event) => setTitle(event.target.value)}
            />

            <textarea
              value={content}
              placeholder="내용을 입력하세요."
              onChange={(event) => setContent(event.target.value)}
            />

            <div className="board-write-button-row">
              <button type="button" onClick={() => onChangePage('home')}>
                취소
              </button>
              <button type="submit">등록</button>
            </div>
          </form>
        </section>

        <section className="board-list-section">
          <div className="board-list-header">
            <div>
              <h2>게시글</h2>
              <p>총 {filteredPosts.length}개</p>
            </div>

            <input
              type="text"
              value={keyword}
              placeholder="검색"
              onChange={(event) => setKeyword(event.target.value)}
            />
          </div>

          <div className="board-filter-list">
            {BOARD_FILTERS.map((filter) => (
              <button
                key={filter}
                className={selectedFilter === filter ? 'active' : ''}
                onClick={() => setSelectedFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="board-table">
            <div className="board-table-head">
              <span>분류</span>
              <span>제목</span>
              <span>작성자</span>
              <span>작성일</span>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="board-empty">
                등록된 게시글이 없습니다.
              </div>
            ) : (
              filteredPosts.map((post) => (
                <article className="board-table-row" key={post.id}>
                  <span className="board-category">{getPostCategory(post)}</span>

                  <div className="board-post-title">
                    <strong>{post.title}</strong>
                    <p>{post.content}</p>
                  </div>

                  <span>me</span>
                  <span>{post.createdAt}</span>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default BoardPage;