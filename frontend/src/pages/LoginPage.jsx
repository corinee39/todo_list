import './LoginPage.css';

function LoginPage({ onLogin }) {
  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-logo-area">
          <div className="login-logo">TODO</div>
          <span className="login-badge">Todo Planner</span>
        </div>

        <div className="login-title-area">
          <h1>
            오늘 할 일을
            <br />
            간단하게 정리해보세요
          </h1>
          <p>
            할 일 관리, 뽀모도로 타이머, 친구와의 기록 공유를 한 곳에서
            사용할 수 있습니다.
          </p>
        </div>

        <div className="login-preview-card">
          <div className="preview-row">
            <span className="preview-check">✓</span>
            <p>오늘 해야 할 일 정리하기</p>
          </div>

          <div className="preview-row">
            <span className="preview-check">✓</span>
            <p>집중 시간 기록하기</p>
          </div>

          <div className="preview-row">
            <span className="preview-check">✓</span>
            <p>친구와 공부 기록 공유하기</p>
          </div>
        </div>

        <div className="social-login-list">
          <button
            className="social-login-button kakao"
            type="button"
            onClick={onLogin}
          >
            <span className="social-icon">K</span>
            카카오로 시작하기
          </button>

          <button
            className="social-login-button google"
            type="button"
            onClick={onLogin}
          >
            <span className="social-icon">G</span>
            구글로 시작하기
          </button>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;