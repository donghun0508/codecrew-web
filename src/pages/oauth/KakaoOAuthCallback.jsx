import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import Spinner from "../../components/common/Spinner";
import useOAuthLogin from "../../hooks/useOAuthLogin";

export default function KakaoOAuthCallback() {
  const [params] = useSearchParams();

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
    window.history.replaceState({}, "", "/oauth2/code/kakao");

    if (code) login();
  }, [code, login]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <Spinner />
    </div>
  );
}
