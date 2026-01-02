import { Link, useLocation } from "react-router-dom";
import { Home, RefreshCw, WifiOff, Shield, AlertTriangle } from "lucide-react";

export default function ConnectionErrorPage() {
  const location = useLocation();
  const errorState = location.state;

  const handleRefresh = () => {
    window.location.reload();
  };

  // 에러 타입에 따른 설정
  const getErrorConfig = () => {
    if (errorState?.type === "unauthorized") {
      return {
        icon: Shield,
        iconColor: "text-red-500",
        bgColor: "bg-red-500",
        borderColor: "border-red-200",
        badge: "인증 실패",
        badgeBg: "border-red-200",
        title: "인증에 실패했습니다",
        description: errorState.message || "토큰이 유효하지 않거나 만료되었습니다.",
      };
    } else if (errorState?.type === "connection") {
      return {
        icon: WifiOff,
        iconColor: "text-gray-400",
        bgColor: "bg-gray-400",
        borderColor: "border-gray-200",
        badge: "연결 실패",
        badgeBg: "border-gray-200",
        title: "서버에 연결할 수 없습니다",
        description: errorState.message || "서버 연결에 실패했습니다.",
      };
    } else {
      return {
        icon: AlertTriangle,
        iconColor: "text-orange-500",
        bgColor: "bg-orange-500",
        borderColor: "border-orange-200",
        badge: "오류 발생",
        badgeBg: "border-orange-200",
        title: "연결 중 오류가 발생했습니다",
        description: errorState?.message || "알 수 없는 오류가 발생했습니다.",
      };
    }
  };

  const config = getErrorConfig();
  const ErrorIcon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* Connection Icon */}
        <div className="relative mb-8">
          <div className={`absolute inset-0 ${config.bgColor} rounded-full blur-3xl opacity-20`}></div>
          <div className="relative inline-block">
            <div className={`bg-white p-8 rounded-full border-4 ${config.borderColor} shadow-2xl`}>
              <ErrorIcon className={`w-24 h-24 ${config.iconColor}`} />
            </div>
            {/* Animated circles */}
            <div className={`absolute inset-0 rounded-full border-4 ${config.borderColor} animate-ping opacity-20`}></div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4 mb-8">
          <div className={`inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border ${config.badgeBg} shadow-lg`}>
            <ErrorIcon className={`w-5 h-5 ${config.iconColor}`} />
            <span className="text-sm font-medium text-gray-700">
              {config.badge}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {config.title}
          </h2>

          <p className="text-gray-600 text-lg max-w-md mx-auto">
            {config.description}
          </p>
        </div>

        {/* Troubleshooting Tips */}
        {errorState?.type !== "unauthorized" && (
          <div className="mb-8 p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 max-w-md mx-auto text-left">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              해결 방법:
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>인터넷 연결 상태를 확인해주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>방화벽이나 보안 프로그램을 확인해주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>VPN을 사용 중이라면 비활성화해보세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>페이지를 새로고침해주세요</span>
              </li>
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {errorState?.type === "unauthorized" ? (
            <>
              <Link
                to="/signin"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg font-semibold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all"
              >
                <Shield className="w-5 h-5" />
                다시 로그인
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <Home className="w-5 h-5" />
                홈으로 돌아가기
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg font-semibold shadow-lg shadow-gray-500/30 hover:shadow-xl hover:shadow-gray-500/40 transition-all"
              >
                <RefreshCw className="w-5 h-5" />
                다시 시도
              </button>

              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <Home className="w-5 h-5" />
                홈으로 돌아가기
              </Link>
            </>
          )}
        </div>

        {/* Error Details */}
        {errorState?.code && (
          <div className="p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200 max-w-md mx-auto">
            <p className="text-xs text-gray-500 font-mono">
              ERROR CODE: {errorState.code}
              {errorState.reason && ` - ${errorState.reason}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
