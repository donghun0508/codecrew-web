import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { memberApi } from "@/api/auth";
import { logoutFromKeycloak } from "@/api/keycloak";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState(() =>
    localStorage.getItem("refreshToken")
  );
  const [userInfo, setUserInfo] = useState(() => {
    const stored = localStorage.getItem("userInfo");
    if (!stored || stored === "undefined" || stored === "null") {
      return null;
    }
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Failed to parse userInfo:", error);
      localStorage.removeItem("userInfo");
      return null;
    }
  });
  const [isInitialized, setIsInitialized] = useState(false);

  const isLoggedIn = !!accessToken;

  const login = useCallback((access, refresh, memberInfo) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("userInfo", JSON.stringify(memberInfo));

    setAccessToken(access);
    setRefreshToken(refresh);
    setUserInfo(memberInfo);
  }, []);

  const logout = useCallback(async () => {
    const currentRefreshToken = localStorage.getItem("refreshToken");

    // Keycloak 세션 종료
    if (currentRefreshToken) {
      await logoutFromKeycloak(currentRefreshToken);
    }

    // 로컬 스토리지 정리
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");
    setAccessToken(null);
    setRefreshToken(null);
    setUserInfo(null);

    // 홈으로 이동
    window.location.href = "/";
  }, []);

  // 앱 시작 시 토큰이 있으면 /me 호출해서 사용자 정보 최신화
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        try {
          // skipAuthRedirect 플래그로 초기 인증 체크임을 표시 (401 시 리다이렉트 안 함)
          const response = await memberApi.me(null, { skipAuthRedirect: true });
          const memberInfo = response.data?.data;

          if (memberInfo) {
            // localStorage 업데이트
            localStorage.setItem("userInfo", JSON.stringify(memberInfo));
            setUserInfo(memberInfo);
          }
        } catch (error) {
          // 401 에러 발생 시 에러 코드 확인
          if (error.response?.status === 401) {
            const errorCode = error.response?.data?.error?.code;

            // Txx 에러 (토큰 자체 문제)만 토큰 제거
            // C006 (인증 필요)는 토큰 갱신 가능하므로 유지
            if (errorCode && errorCode.startsWith("T")) {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("userInfo");
              setAccessToken(null);
              setRefreshToken(null);
              setUserInfo(null);
            }
          }
          // 에러 발생해도 리다이렉트는 안 하고 현재 페이지 유지
        }
      }

      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        userInfo,
        isLoggedIn,
        isInitialized,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
