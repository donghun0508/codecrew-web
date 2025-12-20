import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Code2 } from "lucide-react";
import { authApi, memberApi } from "../api/auth";
import { validateNickname } from "../lib/utils/validation";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../lib/constants/messages";
import Spinner from "../components/common/Spinner";

export default function SignUpExtraPage() {
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    setNickname(e.target.value);
  };

  const onCheckNickname = async () => {
    // 1. 유효성 검사
    const error = validateNickname(nickname);
    if (error) {
      alert(error);
      return;
    }

    // 2. 중복 확인 API 호출
    try {
      const res = await memberApi.checkDuplication(nickname.trim());
      const isDuplicated = res.data?.data?.duplicated;

      if (isDuplicated) {
        alert(ERROR_MESSAGES.NICKNAME_DUPLICATED);
      } else {
        alert(SUCCESS_MESSAGES.NICKNAME_AVAILABLE);
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.error?.message || ERROR_MESSAGES.CHECK_FAILED;
      alert(errorMessage);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // 1. 유효성 검사
    const error = validateNickname(nickname);
    if (error) {
      alert(error);
      return;
    }

    // 2. tempToken 확인
    const tempToken = sessionStorage.getItem("tempToken");
    if (!tempToken) {
      alert(ERROR_MESSAGES.TOKEN_EXPIRED);
      navigate("/signin");
      return;
    }

    // 3. 회원가입 API 호출
    try {
      setLoading(true);
      const res = await authApi.submitExtraInfo(nickname.trim(), tempToken);
      const payload = res.data?.data;

      if (payload?.accessToken) {
        // 4. 사용자 정보 조회
        const me = await memberApi.me(payload.accessToken);
        const memberInfo = me.data?.data;

        // 5. localStorage 저장
        localStorage.setItem("accessToken", payload.accessToken);
        localStorage.setItem("refreshToken", payload.refreshToken);
        localStorage.setItem("userInfo", JSON.stringify(memberInfo));

        // 6. tempToken 제거
        sessionStorage.removeItem("tempToken");

        // 7. 홈으로 이동
        alert(SUCCESS_MESSAGES.SIGNUP_SUCCESS);
        navigate("/");
      } else {
        alert(ERROR_MESSAGES.SIGNUP_FAILED);
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.error?.message || ERROR_MESSAGES.SIGNUP_FAILED;
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
            <Code2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">CodeCrew</h1>
          <p className="text-sm text-gray-600">추가 정보 입력</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="mb-6 text-center">
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              환영합니다!
            </h2>
            <p className="text-sm text-gray-500">
              CodeCrew에서 사용할 닉네임을 설정해주세요
            </p>
          </div>

          <form onSubmit={onSubmit}>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                닉네임 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={nickname}
                  onChange={onChange}
                  placeholder="닉네임을 입력하세요 (2~12자)"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={onCheckNickname}
                  disabled={loading}
                  className="whitespace-nowrap rounded-lg border-2 border-blue-600 px-4 py-3 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  중복확인
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner />
                  <span>처리 중...</span>
                </div>
              ) : (
                "가입 완료"
              )}
            </button>
          </form>
        </div>

        {/* Back to SignIn */}
        <div className="mt-6 text-center">
          <a
            href="/signin"
            className="text-sm text-gray-600 transition-colors hover:text-gray-900"
          >
            ← 로그인으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}
