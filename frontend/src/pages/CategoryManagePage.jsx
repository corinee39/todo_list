import './CategoryManagePage.css';

const DEFAULT_CATEGORY_IDS = ['selfCare', 'study', 'prepare'];

function CategoryManagePage({ onChangePage, todoSections, onDeleteCategory }) {
  const handleDeleteCategory = (sectionId) => {
    const isConfirmed = confirm('이 카테고리를 삭제할까요?');

    if (!isConfirmed) {
      return;
    }

    onDeleteCategory(sectionId);
  };

  return (
    <main className="category-manage-page">
      <div className="category-manage-container">
        <header className="category-manage-header">
          <button
            className="category-back-button"
            onClick={() => onChangePage('home')}
          >
            ←
          </button>

          <div>
            <h1>카테고리 관리</h1>
            <p>카테고리 목록을 확인하고 필요 없는 항목을 정리해보세요.</p>
          </div>
        </header>

        <section className="category-manage-card">
          <div className="category-manage-title-row">
            <h2>전체 카테고리</h2>
            <button
              className="category-create-shortcut"
              onClick={() => onChangePage('categoryCreate')}
            >
              + 등록
            </button>
          </div>

          <div className="category-list">
            {todoSections.map((section) => {
              const isDefaultCategory = DEFAULT_CATEGORY_IDS.includes(section.id);

              return (
                <article className="category-item" key={section.id}>
                  <div className={`category-color-dot ${section.theme}`}></div>

                  <div className="category-info">
                    <strong>{section.title}</strong>
                    <p>할 일 {section.todos.length}개</p>
                  </div>

                  {isDefaultCategory ? (
                    <span className="default-category-badge">기본</span>
                  ) : (
                    <button
                      className="category-delete-button"
                      onClick={() => handleDeleteCategory(section.id)}
                    >
                      삭제
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

export default CategoryManagePage;