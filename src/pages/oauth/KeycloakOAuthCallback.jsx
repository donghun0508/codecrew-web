import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import Spinner from "../../components/common/Spinner";
import { exchangeCodeForToken } from "../../api/keycloak";
import { memberApi } from "../../api/auth";
import { useAuth } from "../../contexts/AuthContext";

export default function KeycloakOAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const code = params.get("code");
  const hasExecuted = useRef(false);
  const { login: authLogin } = useAuth();

  useEffect(() => {
    // 이미 실행되었거나 code가 없으면 로그인 페이지로 이동
    if (hasExecuted.current || !code) {
      navigate("/signin", { replace: true });
      return;
    }

    // 실행 플래그 설정
    hasExecuted.current = true;

    // 히스토리 교체 (뒤로 가기 방지)
    window.history.replaceState({}, "", "/oauth/callback");

    // Keycloak 토큰 교환 및 회원 확인
    handleKeycloakLogin();
  }, [code]);

  const handleKeycloakLogin = async () => {
    try {
      // 1. Keycloak에서 직접 토큰 받기
      const tokenData = await exchangeCodeForToken(code);
      const { access_token, refresh_token } = tokenData;

      // 2. Keycloak 토큰으로 백엔드에 회원 확인
      const verifyResponse = await memberApi.verify(access_token);
      const userData = verifyResponse.data?.data;

      // 3-1. 기존 회원 - 로그인 완료
      if (userData?.registered) {
        // 사용자 정보 조회
        const meResponse = await memberApi.me(access_token);
        const memberInfo = meResponse.data?.data;

        // AuthContext에 Keycloak 토큰 저장
        authLogin(access_token, refresh_token, memberInfo);

        toast.success("로그인 성공!");
        navigate("/", { replace: true });
        return;
      }

      // 3-2. 신규 유저 - 추가 정보 입력 필요
      // Keycloak 토큰을 임시 저장 (회원가입에 사용)
      sessionStorage.setItem("keycloakAccessToken", access_token);
      sessionStorage.setItem("keycloakRefreshToken", refresh_token);

      navigate("/signup-extra", { replace: true });
    } catch (error) {
      console.error("Keycloak OAuth Error:", error);
      const errorMessage =
        error?.response?.data?.error?.message ||
        error?.message ||
        "로그인 중 오류가 발생했습니다.";
      toast.error(errorMessage);
      navigate("/signin", { replace: true });
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <Spinner />
    </div>
  );
}
