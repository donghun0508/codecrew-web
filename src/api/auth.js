import axios from "axios";
import toast from "react-hot-toast";
import { refreshAccessToken } from "./keycloak";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:20020",
  withCredentials: true,
  headers: {
    "X-API-Version": "1.0.0",
  },
});

// Request interceptor: Access token이 있으면 자동으로 모든 요청에 추가
api.interceptors.request.use(
  (config) => {
    // 이미 Authorization 헤더가 설정되어 있으면 덮어쓰지 않음 (tempToken 등 특수 케이스)
    if (!config.headers.Authorization) {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 토큰 갱신 중복 방지용
let isRefreshing = false;
let refreshSubscribers = [];

// 토큰 갱신 완료 시 대기 중인 요청들에게 알림
const onRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};

// 토큰 갱신 대기 큐에 추가
const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// 로그아웃 처리 함수
const handleLogout = (errorMessage, showToast = true) => {
  if (showToast) {
    toast.error(errorMessage || "세션이 만료되었습니다", {
      duration: 3000,
    });
  }

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userInfo");

  setTimeout(
    () => {
      window.location.href = "/";
    },
    showToast ? 1000 : 0
  );
};

// Response interceptor: 401 에러 시 토큰 갱신 시도
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 Unauthorized 응답 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      const errorData = error.response?.data;
      const errorCode = errorData?.error?.code;

      // C006 에러: 인증이 필요합니다 → 토큰 갱신 시도
      if (errorCode !== "C006") {
        // C006이 아닌 다른 401 에러는 그냥 reject
        return Promise.reject(error);
      }

      // 이미 재시도 중이면 대기
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((newAccessToken) => {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("Refresh token not found");
        }

        // Keycloak으로 토큰 갱신 요청
        const tokenData = await refreshAccessToken(refreshToken);
        const { access_token: newAccessToken, refresh_token: newRefreshToken } =
          tokenData;

        if (!newAccessToken) {
          throw new Error("Failed to refresh token");
        }

        // 새 토큰 저장
        localStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // 대기 중인 요청들에게 새 토큰 전달
        onRefreshed(newAccessToken);

        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 갱신 실패 시 모든 대기 중인 요청 거부
        refreshSubscribers = [];

        // 로그아웃 처리
        const errorMessage =
          refreshError.response?.data?.error?.message ||
          "세션이 만료되었습니다. 다시 로그인해주세요.";
        handleLogout(errorMessage);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  oauthLogin: (data) => api.post("/api/v1/oauth/login", data),
};

export const memberApi = {
  // token이 제공되면 명시적으로 사용, 없으면 interceptor가 localStorage에서 가져옴
  // skipAuthRedirect: true 옵션으로 초기 인증 체크 시 401 에러 무시
  me: (token, options = {}) => {
    const config = {
      headers: {},
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return api.get("/api/v1/members/me", config);
  },
  // Keycloak 토큰으로 회원 확인 (회원가입 여부 체크)
  verify: (keycloakAccessToken) =>
    api.get("/api/v1/members/verify", {
      headers: {
        Authorization: `Bearer ${keycloakAccessToken}`,
      },
    }),
  // 닉네임 중복 체크
  checkDuplication: (value, keycloakAccessToken) => {
    const config = {
      headers: {},
    };

    if (keycloakAccessToken) {
      config.headers.Authorization = `Bearer ${keycloakAccessToken}`;
    }

    return api.post(
      "/api/v1/members/duplication-check",
      {
        type: "NICKNAME",
        value,
      },
      config
    );
  },
  // 회원 가입 (Keycloak 토큰 필요)
  register: (nickname, keycloakAccessToken) =>
    api.post(
      "/api/v1/members",
      { nickname },
      {
        headers: {
          Authorization: `Bearer ${keycloakAccessToken}`,
        },
      }
    ),
};

export const youtubeApi = {
  getVideos: (size = 12, lastVideoId = null) => {
    const params = { size };
    if (lastVideoId) {
      params.lastVideoId = lastVideoId;
    }
    return api.get("/api/v1/youtube/videos", { params });
  },
};

export const worldApi = {
  // 내 플레이어 정보 조회 (없으면 404)
  getMyPlayer: () => api.get("/api/v1/players/me"),
  // 캐릭터 등록 (REST API)
  setCharacter: (characterData) => api.post("/api/v1/world-masters/players", characterData),
  // 월드 배정 요청
  matchWorld: (worldId) => api.post("/api/v1/world-masters/assignments", { worldId }),
};
