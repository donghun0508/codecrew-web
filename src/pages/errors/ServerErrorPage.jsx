import { Link } from "react-router-dom";
import { Home, RefreshCw, AlertCircle } from "lucide-react";

export default function ServerErrorPage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* 500 Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-red-500 rounded-full blur-3xl opacity-20"></div>
          <div className="relative">
            <h1 className="text-[150px] md:text-[200px] font-bold bg-gradient-to-br from-red-500 to-orange-600 bg-clip-text text-transparent leading-none">
              500
            </h1>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-red-200 shadow-lg">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium text-gray-700">
              서버 오류
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            일시적인 오류가 발생했습니다
          </h2>

          <p className="text-gray-600 text-lg max-w-md mx-auto">
            서버에서 문제가 발생했습니다.
            <br />
            잠시 후 다시 시도해주시거나 새로고침 해주세요.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg font-semibold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            새로고침
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            <Home className="w-5 h-5" />
            홈으로 돌아가기
          </Link>
        </div>

        {/* Error Code */}
        <div className="mt-12 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200 max-w-md mx-auto">
          <p className="text-xs text-gray-500 font-mono">
            ERROR CODE: INTERNAL_SERVER_ERROR
          </p>
        </div>
      </div>
    </div>
  );
}
