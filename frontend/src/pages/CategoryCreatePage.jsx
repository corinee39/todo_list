import { useState } from 'react';
import './CategoryCreatePage.css';

function CategoryCreatePage({ onChangePage, onAddCategory }) {
  const [categoryName, setCategoryName] = useState('');
  const [theme, setTheme] = useState('purple');

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      alert('카테고리명을 입력해주세요.');
      return;
    }

    onAddCategory({
      title: trimmedName,
      theme,
    });

    alert('카테고리가 등록되었습니다.');
    onChangePage('home');
  };

  return (
    <main className="category-create-page">
      <div className="category-create-container">
        <header className="category-create-header">
          <button
            className="category-back-button"
            onClick={() => onChangePage('home')}
          >
            ←
          </button>

          <div>
            <h1>카테고리 등록</h1>
            <p>할 일을 분류할 새 카테고리를 만들어보세요.</p>
          </div>
        </header>

        <form className="category-create-card" onSubmit={handleSubmit}>
          <label className="category-form-group">
            <span>카테고리명</span>
            <input
              type="text"
              value={categoryName}
              placeholder="예: 정보처리기사 실기 준비"
              onChange={(event) => setCategoryName(event.target.value)}
            />
          </label>

          <div className="category-form-group">
            <span>색상 선택</span>

            <div className="category-theme-list">
              <button
                type="button"
                className={`theme-button purple ${
                  theme === 'purple' ? 'active' : ''
                }`}
                onClick={() => setTheme('purple')}
              >
                보라
              </button>

              <button
                type="button"
                className={`theme-button blue ${
                  theme === 'blue' ? 'active' : ''
                }`}
                onClick={() => setTheme('blue')}
              >
                파랑
              </button>

              <button
                type="button"
                className={`theme-button green ${
                  theme === 'green' ? 'active' : ''
                }`}
                onClick={() => setTheme('green')}
              >
                초록
              </button>

              <button
                type="button"
                className={`theme-button pink ${
                  theme === 'pink' ? 'active' : ''
                }`}
                onClick={() => setTheme('pink')}
              >
                분홍
              </button>
            </div>
          </div>

          <button className="category-submit-button" type="submit">
            카테고리 등록
          </button>
        </form>
      </div>
    </main>
  );
}

export default CategoryCreatePage;