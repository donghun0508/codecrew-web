import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:20020",
  withCredentials: true,
  headers: {
    "X-API-Version": "1.0.0",
  },
});

export const authApi = {
  oauthLogin: (data) => api.post("/api/v1/oauth/login", data),
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
};

export const memberApi = {
  me: (token) =>
    api.get("/api/v1/members/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
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
