import './LoginPage.css';

function LoginPage({ onLogin }) {
  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-logo">TODAY</div>

        <h1>TodoList Project</h1>
        <p>
          할 일, 뽀모도로, 친구의 공부 기록을 한 곳에서 관리해보세요.
        </p>

        <div className="social-login-list">
          <button className="social-login-button google" onClick={onLogin}>
            Google로 시작하기
          </button>

          <button className="social-login-button kakao" onClick={onLogin}>
            Kakao로 시작하기
          </button>

          <button className="social-login-button naver" onClick={onLogin}>
            Naver로 시작하기
          </button>
        </div>

        <span className="login-guide">
          지금은 프론트 화면 확인용 임시 로그인입니다.
        </span>
      </section>
    </main>
  );
}

export default LoginPage;