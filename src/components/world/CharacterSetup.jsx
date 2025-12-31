import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Sparkles, Loader2 } from "lucide-react";
import { worldApi } from "@/api/auth";
import toast from "react-hot-toast";

// 임시 캐릭터 목록 (나중에 실제 이미지로 교체 예정)
const TEMP_CHARACTERS = [
  { id: 1, name: "캐릭터 1", color: "#FF6B6B" },
  { id: 2, name: "캐릭터 2", color: "#4ECDC4" },
  { id: 3, name: "캐릭터 3", color: "#45B7D1" },
  { id: 4, name: "캐릭터 4", color: "#FFA07A" },
  { id: 5, name: "캐릭터 5", color: "#98D8C8" },
  { id: 6, name: "캐릭터 6", color: "#F7DC6F" },
  { id: 7, name: "캐릭터 7", color: "#BB8FCE" },
  { id: 8, name: "캐릭터 8", color: "#85C1E2" },
  { id: 9, name: "캐릭터 9", color: "#F8B739" },
  { id: 10, name: "캐릭터 10", color: "#52C77C" },
];

export default function CharacterSetup({ onComplete }) {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [nickname, setNickname] = useState("");
  const [isEntering, setIsEntering] = useState(false);

  const handleSubmit = async () => {
    if (!selectedCharacter) {
      toast.error("캐릭터를 선택해주세요.");
      return;
    }

    if (!nickname.trim()) {
      toast.error("닉네임을 입력해주세요.");
      return;
    }

    setIsEntering(true);

    try {
      const characterData = {
        worldCode: "world#1",
        avatarId: selectedCharacter.id,
        nickname: nickname.trim(),
      };

      // 1. 서버에 캐릭터 등록 (201 응답)
      await worldApi.setCharacter(characterData);

      // 2. 캐릭터 등록 성공 후 월드 배정 API 호출 (200 응답)
      const matchResponse = await worldApi.matchWorld("world#1");
      const worldData = matchResponse.data?.data;

      // 3. 월드 배정 성공 시 완료 콜백 호출
      if (worldData) {
        onComplete(worldData);
      } else {
        toast.error("월드 배정에 실패했습니다.");
        setIsEntering(false);
      }
    } catch (error) {
      setIsEntering(false);

      // API 인터셉터가 처리하지 못한 에러만 여기서 처리
      const errorCode = error.response?.data?.error?.code;

      if (errorCode && errorCode.startsWith("T")) {
        // Txx 에러는 이미 인터셉터가 로그아웃 처리했으므로 무시
        return;
      }

      // 기타 에러
      toast.error("월드 입장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleRandomSelect = () => {
    const randomChar =
      TEMP_CHARACTERS[Math.floor(Math.random() * TEMP_CHARACTERS.length)];
    setSelectedCharacter(randomChar);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative bg-background/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full border border-white/20">
        {/* Header */}
        <div className="p-8 text-center border-b border-border/50">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            캐릭터 설정
          </h2>
          <p className="text-muted-foreground mt-2">
            World에서 사용할 캐릭터와 닉네임을 설정해주세요
          </p>
        </div>

        {/* Content - 좌우 분할 */}
        <div className="grid grid-cols-2 gap-8 p-8">
          {/* 왼쪽: 캐릭터 선택 */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">캐릭터 선택</h3>

            {/* 선택된 캐릭터 미리보기 */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div
                  className="absolute inset-0 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"
                  style={{
                    backgroundColor: selectedCharacter?.color || "#6366f1",
                  }}
                ></div>
                <div
                  className="relative w-32 h-32 rounded-3xl border-4 border-white/20 flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-105"
                  style={{
                    backgroundColor: selectedCharacter?.color || "#e5e7eb",
                  }}
                >
                  {selectedCharacter ? (
                    <User className="w-16 h-16 text-white" />
                  ) : (
                    <User className="w-16 h-16 text-muted-foreground" />
                  )}
                </div>
              </div>
              <p className="mt-4 text-sm font-medium text-muted-foreground">
                {selectedCharacter
                  ? selectedCharacter.name
                  : "캐릭터를 선택해주세요"}
              </p>
            </div>

            {/* 캐릭터 그리드 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-muted-foreground">
                  캐릭터 목록
                </h4>
                <button
                  onClick={handleRandomSelect}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm font-medium"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>랜덤</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-3 p-4 bg-muted/20 rounded-2xl border border-border/50">
                {TEMP_CHARACTERS.map((character) => (
                  <button
                    key={character.id}
                    onClick={() => setSelectedCharacter(character)}
                    className={`aspect-square rounded-xl border-2 transition-all duration-200 hover:scale-110 flex items-center justify-center relative group ${
                      selectedCharacter?.id === character.id
                        ? "border-white ring-4 ring-primary/50 scale-105 shadow-lg"
                        : "border-white/20 hover:border-white/40"
                    }`}
                    style={{ backgroundColor: character.color }}
                  >
                    <User className="w-8 h-8 text-white transition-transform group-hover:scale-110" />
                    {selectedCharacter?.id === character.id && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-background flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽: 닉네임 입력 및 입장 */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-6">닉네임 설정</h3>

            {/* 닉네임 입력 */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-muted-foreground mb-2">
                닉네임
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="월드에서 사용할 닉네임을 입력하세요"
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl border-2 border-border/50 bg-muted/20 focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground/50"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {nickname.length}/20 자
              </p>
            </div>

            {/* 안내 메시지 */}
            <div className="flex-1 bg-muted/20 rounded-2xl border border-border/50 p-6 mb-6">
              <h4 className="font-semibold text-sm mb-3">입장 안내</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>캐릭터와 닉네임을 선택하고 월드에 입장하세요</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>닉네임은 최대 20자까지 입력 가능합니다</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>다른 사용자들과 함께 즐거운 시간을 보내세요</span>
                </li>
              </ul>
            </div>

            {/* 입장 버튼 */}
            <Button
              onClick={handleSubmit}
              disabled={!selectedCharacter || !nickname.trim() || isEntering}
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              size="lg"
            >
              {isEntering ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  입장 중...
                </span>
              ) : (
                "월드 입장하기"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
