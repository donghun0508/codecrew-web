import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import Spinner from "../../components/common/Spinner";
import useOAuthLogin from "../../hooks/useOAuthLogin";

export default function KakaoOAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const hasExecuted = useRef(false);

  const code = params.get("code");
  const stateRaw = params.get("state");

  // Kakao 특수 처리: state → nonce 추출
  let nonce = null;
  if (stateRaw) {
    try {
      const decoded = decodeURIComponent(stateRaw);
      nonce = JSON.parse(atob(decoded)).nonce;
    } catch {
      nonce = null;
    }
  }

  // OAuth 훅 호출
  const { login } = useOAuthLogin({
    provider: "KAKAO",
    code,
    nonce,
  });

  useEffect(() => {
    // 이미 실행되었거나 code가 없으면 로그인 페이지로 이동
    if (hasExecuted.current || !code) {
      navigate("/signin", { replace: true });
      return;
    }

    // 실행 플래그 설정
    hasExecuted.current = true;

    // 히스토리 교체 (뒤로 가기 방지)
    window.history.replaceState({}, "", "/oauth2/code/kakao");

    login();
  }, [code, login, navigate]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <Spinner />
    </div>
  );
}
