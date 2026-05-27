import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { loginWithGoogleCode, loginWithKakaoCode } from '../api/authApi';

function OAuthCallbackPage({ provider, onLoginSuccess }) {
  const navigate = useNavigate();
  const hasRequestedRef = useRef(false);
  const [message, setMessage] = useState('로그인 처리 중입니다...');

  useEffect(() => {
    if (hasRequestedRef.current) {
      return;
    }

    hasRequestedRef.current = true;

    async function handleOAuthCallback() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        setMessage('로그인에 실패했습니다.');
        alert('소셜 로그인에 실패했습니다.');
        navigate('/login', { replace: true });
        return;
      }

      if (!code) {
        setMessage('인가 코드가 없습니다.');
        alert('로그인 코드가 없습니다.');
        navigate('/login', { replace: true });
        return;
      }

      try {
        if (provider === 'kakao') {
          await loginWithKakaoCode(code);
        }

        if (provider === 'google') {
          await loginWithGoogleCode(code);
        }

        onLoginSuccess();
        navigate('/', { replace: true });
      } catch (error) {
        console.error(error);
        setMessage('로그인 처리에 실패했습니다.');
        alert(error.message || '로그인 처리에 실패했습니다.');
        navigate('/login', { replace: true });
      }
    }

    handleOAuthCallback();
  }, [provider, onLoginSuccess, navigate]);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f6f6f6',
        color: '#222',
        fontWeight: 800,
      }}
    >
      {message}
    </main>
  );
}

export default OAuthCallbackPage;