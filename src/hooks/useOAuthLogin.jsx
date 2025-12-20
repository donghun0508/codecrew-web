import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, memberApi } from "../api/auth";

export default function useOAuthLogin({
  provider,
  code,
  nonce = null,
  state = null,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
        navigate("/signup-extra");
        return;
      }

      // 기존 유저 - 로그인 성공
      if (payload?.accessToken) {
        const me = await memberApi.me(payload.accessToken);
        const memberInfo = me.data.data;

        // 토큰과 사용자 정보를 localStorage에 저장
        localStorage.setItem("accessToken", payload.accessToken);
        localStorage.setItem("refreshToken", payload.refreshToken);
        localStorage.setItem("userInfo", JSON.stringify(memberInfo));

        alert("로그인 성공!");
        navigate("/");
        return;
      }

      alert("로그인에 실패했습니다.");
      navigate("/signin");
    } catch (err) {
      console.error("OAuth Login Error:", err);
      const errorMessage = err?.response?.data?.error?.message || "로그인 중 오류가 발생했습니다.";
      alert(errorMessage);
      navigate("/signin");
    } finally {
      setLoading(false);
    }
  }, [provider, code, nonce, state, navigate]);

  return { login, loading };
}
