import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary rounded-full blur-3xl opacity-20"></div>
          <div className="relative">
            <h1 className="text-[150px] md:text-[200px] font-bold bg-gradient-to-br from-primary to-purple-600 bg-clip-text text-transparent leading-none">
              404
            </h1>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary/20 shadow-lg">
            <Search className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-gray-700">
              페이지를 찾을 수 없습니다
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            요청하신 페이지가 존재하지 않습니다
          </h2>

          <p className="text-gray-600 text-lg max-w-md mx-auto">
            입력하신 주소가 정확한지 다시 한번 확인해주세요.
            <br />
            페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
          >
            <Home className="w-5 h-5" />
            홈으로 돌아가기
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            이전 페이지로
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 flex justify-center gap-8 opacity-50">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  );
}
