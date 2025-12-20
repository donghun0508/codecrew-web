import {
  GOOGLE_AUTH_URL,
  KAKAO_AUTH_URL,
  NAVER_AUTH_URL,
} from "../lib/constants/oauth";
import { Code2 } from "lucide-react";

export default function SignInPage() {
  const generateNonce = () => crypto.randomUUID();

  const handleGoogleLogin = () => {
    window.location.href = `${GOOGLE_AUTH_URL}`;
  };

  const handleKakaoLogin = () => {
    const nonce = generateNonce();
    const state = encodeURIComponent(btoa(JSON.stringify({ nonce })));
    window.location.href = `${KAKAO_AUTH_URL}&nonce=${nonce}&state=${state}`;
  };

  const handleNaverLogin = () => {
    const nonce = generateNonce();
    const state = encodeURIComponent(btoa(JSON.stringify({ nonce })));
    window.location.href = `${NAVER_AUTH_URL}&state=${state}`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
            <Code2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            CodeCrew
          </h1>
          <p className="text-sm text-gray-600">
            함께 성장하는 개발자 커뮤니티
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold leading-tight text-gray-900">
              함께 성장하는
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">개발자 커뮤니티</span>
            </h2>
            <p className="text-sm text-gray-500">
              당신의 코딩 메이트와 함께 더 나은 개발자로 성장하세요
            </p>
          </div>

          {/* Divider */}
          <div className="mb-8 flex items-center">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <span className="px-4 text-xs font-medium text-gray-500">간편로그인</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>

          {/* Social Login Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleNaverLogin}
              className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg"
              aria-label="네이버 로그인"
            >
              <img
                src="/src/assets/social/naver.png"
                alt="naver"
                className="h-14 w-14 rounded-full"
              />
              <div className="absolute inset-0 rounded-full bg-black opacity-0 transition-opacity duration-200 group-hover:opacity-5" />
            </button>

            <button
              onClick={handleKakaoLogin}
              className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg"
              aria-label="카카오 로그인"
            >
              <img
                src="/src/assets/social/kakao.png"
                alt="kakao"
                className="h-14 w-14 rounded-full"
              />
              <div className="absolute inset-0 rounded-full bg-black opacity-0 transition-opacity duration-200 group-hover:opacity-5" />
            </button>

            <button
              onClick={handleGoogleLogin}
              className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg"
              aria-label="구글 로그인"
            >
              <img
                src="/src/assets/social/google.svg"
                alt="google"
                className="h-14 w-14 rounded-full"
              />
              <div className="absolute inset-0 rounded-full bg-black opacity-0 transition-opacity duration-200 group-hover:opacity-5" />
            </button>
          </div>

          {/* Terms */}
          <p className="mt-8 text-center text-xs text-gray-500">
            로그인하면{" "}
            <a href="#" className="text-blue-600 hover:underline">
              서비스 약관
            </a>
            과{" "}
            <a href="#" className="text-blue-600 hover:underline">
              개인정보 처리방침
            </a>
            에 동의하는 것으로 간주됩니다.
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-gray-600 transition-colors hover:text-gray-900"
          >
            ← 홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}
