import './AiTodoPage.css';

function AiTodoPage({ onChangePage }) {
  return (
    <main className="ai-todo-page">
      <div className="ai-todo-container">
        <header className="ai-todo-header">
          <button className="ai-back-button" onClick={() => onChangePage('home')}>
            ←
          </button>

          <div>
            <h1>AI 할 일 생성</h1>
            <p>목표를 입력하면 AI가 실천 가능한 할 일로 쪼개줘요.</p>
          </div>
        </header>

        <section className="ai-input-card">
          <div className="ai-card-title">
            <span className="ai-icon">AI</span>
            <h2>공부 목표</h2>
          </div>

          <input
            className="ai-goal-input"
            type="text"
            defaultValue="정보처리기사 필기 공부하기"
            placeholder="예: 정보처리기사 실기 준비하기"
          />

          <div className="ai-period-list">
            <button className="active">오늘</button>
            <button>이번 주</button>
            <button>직접 입력</button>
          </div>

          <button className="ai-generate-button">AI 추천 받기</button>
        </section>

        <section className="ai-result-section">
          <h2>추천된 할 일</h2>

          <div className="ai-result-card">
            <label className="ai-todo-item">
              <input type="checkbox" defaultChecked />
              <span>운영체제 프로세스와 스레드 개념 정리</span>
            </label>

            <label className="ai-todo-item">
              <input type="checkbox" defaultChecked />
              <span>데이터베이스 정규화 1~3정규형 복습</span>
            </label>

            <label className="ai-todo-item">
              <input type="checkbox" />
              <span>네트워크 TCP/IP 계층 구조 암기</span>
            </label>

            <label className="ai-todo-item">
              <input type="checkbox" />
              <span>소프트웨어 공학 UML 다이어그램 보기</span>
            </label>

            <label className="ai-todo-item">
              <input type="checkbox" defaultChecked />
              <span>필기 기출문제 20문제 풀기</span>
            </label>

            <label className="ai-todo-item">
              <input type="checkbox" />
              <span>오답노트 정리하기</span>
            </label>
          </div>
        </section>

        <button className="ai-add-button">선택한 할 일 추가</button>
      </div>
    </main>
  );
}

export default AiTodoPage;