import axios from "axios";
import toast from "react-hot-toast";

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

  setTimeout(() => {
    window.location.href = "/";
  }, showToast ? 1000 : 0);
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

      // 초기 인증 체크 시에는 401 에러를 무시 (리다이렉트 안 함)
      if (originalRequest.skipAuthRedirect) {
        return Promise.reject(error);
      }

      // 토큰 갱신 API 자체가 실패한 경우 → 에러 코드별 처리
      if (originalRequest.url?.includes("/api/v1/auth/tokens")) {
        console.error("토큰 갱신 실패 - 로그아웃:", errorData);

        let logoutMessage;
        let showToast = true;

        // 에러 코드별 메시지 처리
        if (errorCode === "T002") {
          // INVALID_REFRESH_TOKEN
          logoutMessage = "비정상적인 로그인 시도가 감지되었습니다. 보안을 위해 로그아웃되었습니다.";
        } else if (errorCode === "T003") {
          // TOKEN_INVALID
          logoutMessage = "다시 로그인해주세요.";
        } else if (errorCode === "C006") {
          // 초기 로드 시 예상되는 에러이므로 토스트 안 띄움
          showToast = false;
          logoutMessage = "인증이 필요합니다.";
        } else {
          logoutMessage = errorData?.error?.message || "인증 정보가 유효하지 않습니다.";
        }

        handleLogout(logoutMessage, showToast);
        return Promise.reject(error);
      }

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

        console.log("토큰 갱신 시도 중...");

        // 토큰 갱신 요청
        const response = await api.post("/api/v1/auth/tokens", {
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data?.data || {};

        if (!newAccessToken) {
          throw new Error("Failed to refresh token");
        }

        // 새 토큰 저장
        localStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        console.log("토큰 갱신 성공");

        // 대기 중인 요청들에게 새 토큰 전달
        onRefreshed(newAccessToken);

        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("토큰 갱신 실패:", refreshError);

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
  // tempToken을 위한 특별 처리: interceptor를 우회하고 명시적으로 전달
  submitExtraInfo: (nickname, tempToken) =>
    api.post(
      "/api/v1/oauth/signup",
      { nickname },
      {
        headers: {
          Authorization: `Bearer ${tempToken}`,
        },
      }
    ),
  // Refresh token으로 새 토큰 발급
  refreshTokens: (refreshToken) =>
    api.post("/api/v1/auth/tokens", { refreshToken }),
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
  checkDuplication: (value) =>
    api.post("/api/v1/members/duplication-check", { value }),
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
