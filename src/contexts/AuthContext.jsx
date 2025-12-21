import { createContext, useContext, useState, useCallback } from "react";

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
    return stored ? JSON.parse(stored) : null;
  });

  const isLoggedIn = !!accessToken;

  const login = useCallback((access, refresh, memberInfo) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("userInfo", JSON.stringify(memberInfo));

    setAccessToken(access);
    setRefreshToken(refresh);
    setUserInfo(memberInfo);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");
    setAccessToken(null);
    setRefreshToken(null);
    setUserInfo(null);
    window.location.reload();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        userInfo,
        isLoggedIn,
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
