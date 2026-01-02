import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Lock,
  Users,
  Clock,
  LogOut,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  Smile,
  Send,
  Bell,
  BellOff,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CharacterSetup from "@/components/world/CharacterSetup";
import Spinner from "@/components/common/Spinner";
import { worldApi } from "@/api/auth";
import EmojiPicker from "emoji-picker-react";

export default function WorldPage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [showCharacterSetup, setShowCharacterSetup] = useState(false);
  const [isLoadingCharacter, setIsLoadingCharacter] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("chat"); // "chat" or "participants"
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showNotice, setShowNotice] = useState(true);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [chatHeight, setChatHeight] = useState(45); // vh 단위 (기본 45%)
  const [isDragging, setIsDragging] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // WebSocket 관련 상태
  const wsRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionUrl, setConnectionUrl] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // 월드 데이터 상태
  const [worldData, setWorldData] = useState(null);
  const [noticeData, setNoticeData] = useState(null);
  const [onlineCount, setOnlineCount] = useState(0);

  // 채팅 상태
  const [chatMessage, setChatMessage] = useState("");
  const [chatAreaType] = useState("PRIVATE_AREA"); // "PUBLIC_AREA" or "PRIVATE_AREA"

  // 월드 배정 요청
  useEffect(() => {
    const matchWorld = async () => {
      if (!isLoggedIn) {
        setIsLoadingCharacter(false);
        return;
      }

      try {
        const response = await worldApi.matchWorld("world#1");
        const worldData = response.data?.data;

        if (worldData) {
          setCharacter(worldData);
          setShowCharacterSetup(false);

          // WebSocket 연결 정보 저장
          if (worldData.connectionUrl) {
            setConnectionUrl(worldData.connectionUrl);
          }
        } else {
          setShowCharacterSetup(true);
        }
      } catch (error) {
        // 404 에러: 캐릭터 설정이 필요함
        if (error.response?.status === 404) {
          setShowCharacterSetup(true);
        } else {
          // 다른 에러는 콘솔에 로그만 남김
          console.error("월드 배정 요청 실패:", error);
          setShowCharacterSetup(true);
        }
      } finally {
        setIsLoadingCharacter(false);
      }
    };

    matchWorld();
  }, [isLoggedIn]);

  const handleCharacterSetupComplete = (characterData) => {
    setCharacter(characterData);
    setShowCharacterSetup(false);
  };

  // 채팅 메시지 전송
  const sendChatMessage = () => {
    if (!chatMessage.trim() || !wsRef.current || !isConnected) return;

    const message = {
      message: chatMessage.trim(),
      chatAreaType: chatAreaType,
    };

    try {
      wsRef.current.send(JSON.stringify(message));
      setChatMessage("");
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    }
  };

  // Enter 키로 메시지 전송
  const handleChatKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  // WebSocket 연결
  useEffect(() => {
    if (!connectionUrl) return;

    setIsConnecting(true);

    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(connectionUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
          setIsConnecting(false);
        };

        ws.onmessage = (event) => {
          console.log("WebSocket 메시지:", event.data);

          try {
            const message = JSON.parse(event.data);

            // INITIAL_SYNC 메시지 처리
            if (message.type === "INITIAL_SYNC") {
              const { payload } = message;

              // 월드 정보 업데이트
              if (payload.world) {
                setWorldData(payload.world);
              }

              // 공지사항 업데이트
              if (payload.notice) {
                setNoticeData(payload.notice);
              }

              // 접속자 수 업데이트
              if (payload.online) {
                setOnlineCount(payload.online.currentOnline);
              }
            }

            // TODO: 다른 메시지 타입 처리
          } catch (error) {
            console.error("메시지 파싱 실패:", error);
          }
        };

        ws.onerror = () => {
          setIsConnected(false);
          setIsConnecting(false);
        };

        ws.onclose = (event) => {
          setIsConnected(false);
          setIsConnecting(false);

          // 정상 종료가 아닌 경우 에러 처리
          if (!event.wasClean) {
            // Close code에 따라 에러 처리
            if (event.code === 1008 || event.code === 4001 || event.code === 4401) {
              // 인증 실패 (Policy Violation, Custom Unauthorized)
              navigate("/error/connection", {
                state: {
                  type: "unauthorized",
                  message: event.reason || "인증에 실패했습니다. 토큰을 확인해주세요.",
                  code: event.code
                }
              });
            } else if (event.code === 1006) {
              // 비정상 종료 (서버 응답 없음)
              navigate("/error/connection", {
                state: {
                  type: "connection",
                  message: "서버에 연결할 수 없습니다.",
                  code: event.code
                }
              });
            } else {
              // 기타 에러
              navigate("/error/connection", {
                state: {
                  type: "unknown",
                  message: event.reason || "연결에 실패했습니다.",
                  code: event.code
                }
              });
            }
          }
        };
      } catch {
        setIsConnecting(false);
        navigate("/error/connection");
      }
    };

    connectWebSocket();

    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connectionUrl, navigate]);

  // 채팅 높이 드래그 조절 핸들러
  const handleDragStart = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);

      // 데스크톱으로 전환되면 높이 리셋
      if (desktop) {
        setChatHeight(45);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 드래그 핸들러
  useEffect(() => {
    if (!isDragging) return;

    // 드래그 중 스크롤 방지
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const handleDragMove = (e) => {
      e.preventDefault();

      // 마우스 또는 터치 이벤트 모두 지원
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const windowHeight = window.innerHeight;

      // 화면 하단에서 터치/마우스 위치까지의 높이를 vh로 계산
      const newHeight = ((windowHeight - clientY) / windowHeight) * 100;

      // 최소 30vh, 최대 60vh로 제한
      const clampedHeight = Math.max(30, Math.min(60, newHeight));
      setChatHeight(clampedHeight);
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };

    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchmove", handleDragMove, { passive: false });
    document.addEventListener("touchend", handleDragEnd);

    return () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchmove", handleDragMove);
      document.removeEventListener("touchend", handleDragEnd);
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isDragging]);

  // 로그인하지 않은 경우 안내 페이지 표시
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center space-y-6 px-4">
            {/* Lock Icon with Glow */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary rounded-full blur-2xl opacity-30"></div>
              <div className="relative bg-muted/50 backdrop-blur-sm p-8 rounded-full border-2 border-border">
                <Lock className="w-20 h-20 text-muted-foreground" />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold">
                로그인이 필요합니다
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                World는 로그인 후 사용 가능합니다.
                <br />
                CodeCrew 계정으로 로그인해주세요.
              </p>
            </div>

            {/* Login Button */}
            <div className="pt-4">
              <Link to="/signin">
                <Button size="lg" className="px-8 py-6 text-lg">
                  로그인하러 가기
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 캐릭터 데이터 로딩 중
  if (isLoggedIn && isLoadingCharacter) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center space-y-4">
            <Spinner />
            <p className="text-sm text-gray-600">월드 정보를 불러오는 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 캐릭터 설정이 필요한 경우
  if (showCharacterSetup) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 pt-16">
          <CharacterSetup onComplete={handleCharacterSetupComplete} />
        </div>
        <Footer />
      </div>
    );
  }

  // WebSocket 연결 중
  if (isConnecting || (connectionUrl && !isConnected)) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center space-y-4">
            <Spinner />
            <p className="text-sm text-gray-600">월드 서버에 연결하는 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content - 전체 화면 */}
      <main className="flex-1 flex overflow-hidden lg:flex-row flex-col relative">
        {/* 메타버스 캔버스 영역 - 모바일에서는 전체 화면 */}
        <div
          className="flex-1 flex flex-col lg:flex-col relative transition-all duration-200"
          style={{
            height: !isDesktop && isChatOpen ? `calc(100vh - ${chatHeight}vh)` : 'auto'
          }}
        >
          {/* 상단 헤더 영역 - 모바일에서는 오버레이 */}
          <div className="lg:relative absolute top-0 left-0 right-0 z-20 bg-white/90 lg:bg-white backdrop-blur-sm lg:backdrop-blur-none border-b border-gray-200 px-2 sm:px-4 py-2 sm:py-3 shadow-sm">
            <div className="flex items-center justify-between">
              {/* 왼쪽: 라이브 뱃지 */}
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded-md text-xs font-bold uppercase flex items-center gap-1 sm:gap-1.5 shadow-lg shadow-red-600/30">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  LIVE
                </div>
                <div className="text-gray-700 px-2 sm:px-3 py-1 text-xs font-semibold flex items-center gap-1 sm:gap-1.5">
                  <Users className="w-3 h-3" />
                  <span className="hidden sm:inline">{onlineCount}명 접속중</span>
                  <span className="sm:hidden">{onlineCount}명</span>
                </div>
              </div>

              {/* 오른쪽: 버튼들 */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 hover:bg-gray-100 lg:hover:bg-gray-100 hover:bg-white/50 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">나가기</span>
                </button>
                {!isChatOpen && (
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 hover:bg-gray-100 lg:hover:bg-gray-100 hover:bg-white/50 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="hidden sm:inline">채팅 열기</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 중간 메인 캔버스 영역 */}
          <div className="flex-1 bg-gray-100 relative flex items-center justify-center">
            {/* 임시 콘텐츠 */}
            <div className="text-gray-300 text-center">
              <p className="text-4xl font-bold mb-2">메타버스 영역</p>
              <p className="text-xl">캔버스 구현 예정</p>
            </div>
          </div>

          {/* 하단 메타데이터 영역 */}
          <div className="bg-white lg:bg-gray-50/50 border-t border-gray-200 px-3 sm:px-4 md:px-6 py-3 md:py-4 shadow-[0_-2px_8px_rgba(0,0,0,0.05)] z-10 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              {/* 월드 아이콘/썸네일 + 정보 */}
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full sm:w-auto">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0 ring-2 ring-white">
                  <span className="text-lg sm:text-xl font-bold text-white">
                    W1
                  </span>
                </div>

                {/* 월드 정보 */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-gray-900 font-bold text-sm sm:text-base lg:text-lg mb-0.5">
                    {worldData?.worldName || "CodeCrew World"}
                  </h2>
                  <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-600 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{onlineCount}명 시청중</span>
                      <span className="sm:hidden">{onlineCount}명</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">방금 입장</span>
                      <span className="sm:hidden">입장</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>👤</span>
                      <span className="truncate max-w-[100px] sm:max-w-none">
                        {character?.nickname || "플레이어"}
                      </span>
                    </div>
                    <div className="hidden sm:block px-2 py-0.5 bg-gray-100 rounded text-xs border border-gray-200">
                      🎮 메타버스
                    </div>
                  </div>
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-all text-sm font-medium border border-gray-300 hover:border-gray-400">
                  팔로우
                </button>
                <button className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all text-sm font-medium shadow-md hover:shadow-lg">
                  구독
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 채팅 영역 - 모바일: 하단 슬라이드, 데스크톱: 우측 사이드바 */}
        {isChatOpen && (
          <div
            className={`fixed bottom-0 left-0 right-0 lg:relative lg:inset-auto lg:w-96 bg-white lg:border-l border-gray-200 flex flex-col shadow-[0_-4px_16px_rgba(0,0,0,0.1)] lg:shadow-[-4px_0_16px_rgba(0,0,0,0.05)] z-30 rounded-t-2xl lg:rounded-none ${
              !isDragging ? "transition-all duration-200" : ""
            }`}
            style={{
              height: isDesktop ? "auto" : `${chatHeight}vh`,
              maxHeight: isDesktop ? "none" : "60vh",
            }}
          >
            {/* 드래그 핸들 (모바일만) */}
            <div
              className="lg:hidden flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              <div className="w-14 h-1.5 bg-gray-400 rounded-full shadow-sm"></div>
            </div>

            {/* 헤더 영역 */}
            <div className="border-b border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm bg-white rounded-t-2xl lg:rounded-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* 닫기 버튼 */}
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="닫기"
                  >
                    <ChevronDown className="w-[18px] h-[18px] text-gray-600 lg:hidden" />
                    <ChevronRight className="w-[18px] h-[18px] text-gray-600 hidden lg:block" />
                  </button>

                  {/* 탭 버튼들 */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => setActiveTab("chat")}
                      className={`px-2.5 sm:px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                        activeTab === "chat"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      채팅
                    </button>
                    <button
                      onClick={() => setActiveTab("participants")}
                      className={`px-2.5 sm:px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                        activeTab === "participants"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      참여자
                    </button>
                  </div>
                </div>

                {/* 데스크톱: 공지사항 토글 버튼 */}
                <button
                  onClick={() => setShowNotice(!showNotice)}
                  className="hidden lg:block p-1 hover:bg-gray-100 rounded transition-colors"
                  title={showNotice ? "공지사항 끄기" : "공지사항 켜기"}
                >
                  {showNotice ? (
                    <Bell className="w-[18px] h-[18px] text-primary" />
                  ) : (
                    <BellOff className="w-[18px] h-[18px] text-gray-400" />
                  )}
                </button>

                {/* 모바일: 공지사항 버튼 (모달 열기) */}
                <button
                  onClick={() => setShowNoticeModal(true)}
                  className="lg:hidden px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  공지사항
                </button>
              </div>
            </div>

            {/* 탭 컨텐츠 영역 */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === "chat" ? (
                /* 채팅 탭 */
                <div className="px-3 sm:px-4 py-3 sm:py-4">
                  {/* 예시 채팅 메시지 */}
                  <div className="space-y-3">
                    <div className="py-2">
                      <p className="text-xs text-gray-600 leading-relaxed">
                        채팅 기능은 곧 구현될 예정입니다
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* 참여자 탭 */
                <div className="px-3 sm:px-4 py-3 sm:py-4">
                  {/* 참여자 수 헤더 */}
                  <div className="flex items-center gap-2 py-2 mb-3">
                    <Users className="w-3.5 h-3.5 text-gray-600" />
                    <span className="text-xs font-medium text-gray-900">
                      {onlineCount}명 참여중
                    </span>
                  </div>

                  {/* 참여자 목록 */}
                  <div className="space-y-2">
                    <div className="text-center py-12">
                      <p className="text-xs text-gray-500">참여자가 없습니다</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 채팅 입력 영역 - 메타데이터와 같은 라인 */}
            <div className="border-t border-gray-200 px-3 sm:pl-4 sm:pr-2 py-3 sm:py-[1.15rem]">
              <div className="relative flex items-center gap-2">
                {/* 입력창 + 전송 버튼 */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="채팅을 입력하세요"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={handleChatKeyDown}
                    disabled={!isConnected}
                    className="w-full px-3 sm:px-4 pr-14 sm:pr-18 py-3 sm:py-4 rounded-lg bg-white border-2 border-gray-200 text-gray-900 text-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400 shadow-sm"
                  />

                  {/* 인풋 안: 전송 버튼 */}
                  <button
                    onClick={sendChatMessage}
                    disabled={!isConnected || !chatMessage.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary hover:bg-primary/90 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    title="전송"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* 인풋 밖: 이모티콘 버튼 + 피커 */}
                <div className="relative flex-shrink-0">
                  {/* 이모티콘 피커 */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-full right-0 mb-2 z-50">
                      <style>{`
                        .epr-emoji-category-label {
                          display: none !important;
                        }
                      `}</style>
                      <div className="hidden sm:block">
                        <EmojiPicker
                          onEmojiClick={(emojiData) => {
                            console.log("Selected emoji:", emojiData.emoji);
                            setShowEmojiPicker(false);
                          }}
                          width={320}
                          height={400}
                          searchPlaceholder="이모티콘 검색..."
                          previewConfig={{
                            showPreview: false,
                          }}
                        />
                      </div>
                      <div className="sm:hidden">
                        <EmojiPicker
                          onEmojiClick={(emojiData) => {
                            console.log("Selected emoji:", emojiData.emoji);
                            setShowEmojiPicker(false);
                          }}
                          width={280}
                          height={350}
                          searchPlaceholder="이모티콘 검색..."
                          previewConfig={{
                            showPreview: false,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-all border border-transparent hover:border-gray-200 hover:shadow-sm"
                    title="이모티콘"
                  >
                    <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* 하단 공지사항 - 데스크톱만 표시 (모바일은 헤더 버튼으로 모달) */}
            {isDesktop && showNotice && (
              <div className="border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 bg-gray-50/50 flex items-center min-h-[70px] sm:min-h-[89px] shadow-[0_-1px_4px_rgba(0,0,0,0.03)] relative">
                {/* 좌측 강조 라인 */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 sm:h-12 bg-gradient-to-b from-primary to-purple-600 rounded-r"></div>

                {/* 공지사항 컨텐츠 */}
                <div className="flex items-center w-full ml-2 sm:ml-3">
                  {/* 아이콘 */}
                  <div className="flex-shrink-0 mr-2 sm:mr-3">
                    <button
                      onClick={() => setShowNoticeModal(true)}
                      className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer"
                      title="공지사항 자세히 보기"
                    >
                      <span className="text-sm sm:text-base">📢</span>
                    </button>
                  </div>

                  {/* 텍스트 영역 */}
                  <div className="flex-1 overflow-hidden">
                    <div className="text-xs text-gray-500 mb-0.5 font-medium">
                      공지사항
                    </div>
                    <div className="overflow-hidden">
                      <div className="whitespace-nowrap text-xs sm:text-sm text-gray-700 font-medium animate-marquee">
                        {noticeData?.body || "공지사항이 없습니다."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 공지사항 모달 */}
      {showNoticeModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
          onClick={() => setShowNoticeModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10">
                  <span className="text-lg sm:text-xl">📢</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  공지사항
                </h3>
              </div>
              <button
                onClick={() => setShowNoticeModal(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* 모달 본문 */}
            <div className="px-4 sm:px-6 py-5 sm:py-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                    {noticeData?.title || "공지사항"}
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {noticeData?.body || "공지사항이 없습니다."}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                    이용 안내
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>
                        실시간 채팅을 통해 다른 유저들과 소통할 수 있습니다
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>메타버스 공간에서 자유롭게 활동하세요</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>문의사항이 있으시면 언제든 연락해주세요</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 모달 푸터 */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setShowNoticeModal(false)}
                className="w-full px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all font-medium shadow-md text-sm sm:text-base"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
