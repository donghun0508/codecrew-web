import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi, memberApi } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";

export default function useOAuthLogin({
  provider,
  code,
  nonce = null,
  state = null,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { login: authLogin } = useAuth();

  const login = useCallback(async () => {
    try {
      const res = await authApi.oauthLogin({
        socialType: provider,
        authorizationCode: code,
        nonce,
        state,
      });

      const payload = res.data?.data;

      // 신규 유저 - 회원가입 필요
      if (payload?.temporaryToken) {
        sessionStorage.setItem("tempToken", payload.temporaryToken);
        navigate("/signup-extra", { replace: true });
        return;
      }

      // 기존 유저 - 로그인 성공
      if (payload?.accessToken) {
        const me = await memberApi.me(payload.accessToken);
        const memberInfo = me.data.data;

        // AuthContext의 login 함수 사용
        authLogin(payload.accessToken, payload.refreshToken, memberInfo);

        // tempToken 제거 (혹시 남아있을 경우를 대비)
        sessionStorage.removeItem("tempToken");

        toast.success("로그인 성공!");
        navigate("/", { replace: true });
        return;
      }

      toast.error("로그인에 실패했습니다.");
      navigate("/signin", { replace: true });
    } catch (err) {
      console.error("OAuth Login Error:", err);
      const errorMessage = err?.response?.data?.error?.message || "로그인 중 오류가 발생했습니다.";
      toast.error(errorMessage);
      navigate("/signin", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [provider, code, nonce, state, navigate, authLogin]);

  return { login, loading };
}
