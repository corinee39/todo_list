import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithKakao } from "../api/authAPI";

function KakaoCallbackPage({ onLoginSuccess }) {
  const navigate = useNavigate();

  // React 개발 모드에서 useEffect가 중복 실행되는 것을 막기 위한 값
  const isProcessingRef = useRef(false);

  useEffect(() => {
    const handleKakaoCallback = async () => {
      // 이미 카카오 로그인 처리 중이면 다시 실행하지 않음
      if (isProcessingRef.current) {
        return;
      }
      isProcessingRef.current = true;

      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        alert("카카오 인가 코드가 없습니다.");
        navigate("/login");
        return;
      }

      try {
        await loginWithKakao(code);

        // App.jsx의 isLoggedIn 상태를 true로 변경
        onLoginSuccess();
      } catch (error) {
        console.error(error);
        alert("카카오 로그인에 실패했습니다.");
        navigate("/login");
      }
    };

    handleKakaoCallback();
  }, [navigate, onLoginSuccess]);

  return <div>카카오 로그인 처리 중...</div>;
}

export default KakaoCallbackPage;
