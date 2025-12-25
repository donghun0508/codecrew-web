import { useState } from "react";
import { ChevronDown, ChevronUp, Code } from "lucide-react";

// 레벨별 색상
const levelColors = {
  beginner: {
    border: "border-emerald-400",
    bg: "bg-emerald-50",
    icon: "bg-emerald-500",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700",
    label: "🟢 초급",
  },
  intermediate: {
    border: "border-blue-400",
    bg: "bg-blue-50",
    icon: "bg-blue-500",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-700",
    label: "🔵 중급",
  },
  advanced: {
    border: "border-purple-400",
    bg: "bg-purple-50",
    icon: "bg-purple-500",
    text: "text-purple-700",
    badge: "bg-purple-100 text-purple-700",
    label: "🟣 고급",
  },
};

// 로드맵 아이템 컴포넌트
function RoadmapItem({ section, index, isLeft }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const color = levelColors[section.level] || levelColors.beginner;
  const hasChildren = section.children && section.children.length > 0;

  return (
    <div className="mb-24 relative">
      {/* 메인 카드 */}
      <div className={`flex items-center gap-12 ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
        {/* 카드 */}
        <div className="flex-1">
          <div
            className={`
              relative p-6 rounded-2xl border-4 ${color.border} ${color.bg}
              shadow-xl transition-all duration-300
              ${hasChildren ? "cursor-pointer hover:shadow-2xl hover:-translate-y-1" : ""}
            `}
            onClick={() => hasChildren && setIsExpanded(!isExpanded)}
          >
            {/* 화살표 장식 */}
            <div
              className={`
                absolute top-1/2 -translate-y-1/2 w-0 h-0
                ${isLeft ? "-right-6" : "-left-6"}
              `}
              style={{
                borderTop: "24px solid transparent",
                borderBottom: "24px solid transparent",
                [isLeft ? "borderLeft" : "borderRight"]: `24px solid currentColor`,
              }}
              className={color.text}
            />

            <div className="flex items-start gap-4">
              {/* 아이콘 */}
              <div className={`p-4 rounded-xl ${color.icon} text-white flex-shrink-0`}>
                <Code className="w-8 h-8" />
              </div>

              {/* 내용 */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-2xl text-gray-900">{section.title}</h3>
                  {hasChildren && (
                    <div className={`${color.icon} text-white p-2 rounded-lg`}>
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  )}
                </div>

                {section.description && (
                  <p className="text-gray-600 mb-3">{section.description}</p>
                )}

                <div className="flex items-center gap-3">
                  <span className={`text-sm px-3 py-1 rounded-full font-semibold ${color.badge}`}>
                    {color.label}
                  </span>
                  {hasChildren && (
                    <span className="text-sm text-gray-500">
                      {section.children.length}개 항목
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 중앙 번호 마커 */}
        <div className="relative flex-shrink-0 z-10">
          <div className={`
            w-20 h-20 rounded-full ${color.icon} text-white
            flex items-center justify-center font-bold text-2xl
            border-8 border-white shadow-2xl
          `}>
            {index + 1}
          </div>
        </div>

        {/* 빈 공간 */}
        <div className="flex-1" />
      </div>

      {/* 확장된 세부 항목들 */}
      {hasChildren && isExpanded && (
        <div className={`
          mt-8 ml-32 mr-32 space-y-3
          animate-in slide-in-from-top-4 duration-500
        `}>
          {section.children.map((child, idx) => (
            <div
              key={idx}
              className={`
                p-4 rounded-xl border-2 ${color.border} bg-white
                shadow-md hover:shadow-lg transition-all duration-200
                cursor-pointer hover:-translate-y-0.5
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${color.icon}`} />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{child.title}</h4>
                  {child.description && (
                    <p className="text-sm text-gray-600 mt-1">{child.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RoadmapSH({ roadmapData }) {
  return (
    <div className="relative max-w-7xl mx-auto py-12">
      {/* 중앙 세로 경로선 */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-300 via-blue-300 to-purple-300 -translate-x-1/2 opacity-30" />

      {/* SVG 곡선 경로 */}
      <svg className="absolute left-1/2 top-0 w-full h-full pointer-events-none -translate-x-1/2" style={{ zIndex: 0 }}>
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#10b981", stopOpacity: 0.3 }} />
            <stop offset="50%" style={{ stopColor: "#3b82f6", stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: "#8b5cf6", stopOpacity: 0.3 }} />
          </linearGradient>
        </defs>
        {roadmapData.children && roadmapData.children.map((_, idx) => {
          if (idx === roadmapData.children.length - 1) return null;
          const y1 = (idx + 1) * 300;
          const y2 = (idx + 2) * 300;
          const x1 = idx % 2 === 0 ? "75%" : "25%";
          const x2 = (idx + 1) % 2 === 0 ? "75%" : "25%";

          return (
            <path
              key={idx}
              d={`M ${x1} ${y1} Q 50% ${(y1 + y2) / 2} ${x2} ${y2}`}
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="4"
              strokeDasharray="10,5"
            />
          );
        })}
      </svg>

      {/* 로드맵 아이템들 */}
      <div className="relative" style={{ zIndex: 1 }}>
        {roadmapData.children && roadmapData.children.map((section, index) => (
          <RoadmapItem
            key={section.id || index}
            section={section}
            index={index}
            isLeft={index % 2 === 0}
          />
        ))}
      </div>

      {/* 안내 */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl shadow-lg">
        <div className="flex items-start gap-4">
          <div className="text-3xl">💡</div>
          <div>
            <h4 className="font-bold text-lg text-gray-900 mb-2">사용 방법</h4>
            <p className="text-sm text-gray-700">
              큰 박스를 클릭하면 세부 학습 항목이 나타납니다. 단계별로 따라가며 학습 경로를 확인하세요!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
