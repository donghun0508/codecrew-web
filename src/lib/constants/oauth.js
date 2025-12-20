const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT = import.meta.env.VITE_GOOGLE_REDIRECT;

const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const KAKAO_REDIRECT = import.meta.env.VITE_KAKAO_REDIRECT;

const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
const NAVER_REDIRECT = import.meta.env.VITE_NAVER_REDIRECT;

export const GOOGLE_AUTH_URL =
  `https://accounts.google.com/o/oauth2/v2/auth` +
  `?client_id=${GOOGLE_CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT)}` +
  `&response_type=code` +
  `&scope=openid email profile`;

export const KAKAO_AUTH_URL =
  `https://kauth.kakao.com/oauth/authorize` +
  `?client_id=${KAKAO_REST_API_KEY}` +
  `&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT)}` +
  `&response_type=code`;

export const NAVER_AUTH_URL =
  `https://nid.naver.com/oauth2.0/authorize` +
  `?client_id=${NAVER_CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(NAVER_REDIRECT)}` +
  `&response_type=code`;
