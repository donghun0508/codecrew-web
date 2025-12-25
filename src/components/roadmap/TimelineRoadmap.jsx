import { useState, useEffect, useRef } from "react";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

// 레벨별 스타일 설정
const levelStyles = {
  beginner: {
    color: "from-amber-400 to-orange-500",
    borderColor: "border-amber-400",
    bgColor: "bg-amber-50",
    textColor: "text-amber-900",
    dotColor: "bg-amber-400",
    badge: "🟡 초급",
    badgeBg: "bg-amber-100 text-amber-700",
  },
  intermediate: {
    color: "from-emerald-400 to-green-500",
    borderColor: "border-emerald-400",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-900",
    dotColor: "bg-emerald-400",
    badge: "🟢 중급",
    badgeBg: "bg-emerald-100 text-emerald-700",
  },
  advanced: {
    color: "from-violet-400 to-purple-500",
    borderColor: "border-violet-400",
    bgColor: "bg-violet-50",
    textColor: "text-violet-900",
    dotColor: "bg-violet-400",
    badge: "🔵 고급",
    badgeBg: "bg-violet-100 text-violet-700",
  },
};

// 개별 아이템 컴포넌트
function RoadmapItem({ item, index, isLeft }) {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef(null);
  const style = levelStyles[item.level] || levelStyles.beginner;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={itemRef}
      className={`
        flex items-center gap-8 mb-12 transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-x-0" : `opacity-0 ${isLeft ? "-translate-x-12" : "translate-x-12"}`}
      `}
    >
      {/* 왼쪽 카드 영역 */}
      {isLeft && (
        <div className="flex-1">
          <ItemCard item={item} style={style} isLeft={true} />
        </div>
      )}
      {!isLeft && <div className="flex-1" />}

      {/* 중앙 타임라인 */}
      <div className="relative flex flex-col items-center">
        <div className={`w-5 h-5 rounded-full ${style.dotColor} border-4 border-white shadow-lg z-10`} />
      </div>

      {/* 오른쪽 카드 영역 */}
      {!isLeft && (
        <div className="flex-1">
          <ItemCard item={item} style={style} isLeft={false} />
        </div>
      )}
      {isLeft && <div className="flex-1" />}
    </div>
  );
}

// 카드 컴포넌트
function ItemCard({ item, style, isLeft }) {
  return (
    <div
      className={`
        group relative p-6 rounded-xl border-2 ${style.borderColor} ${style.bgColor}
        transition-all duration-300 hover:shadow-2xl hover:-translate-y-2
        cursor-pointer
      `}
    >
      {/* 화살표 */}
      <div
        className={`
          absolute top-1/2 -translate-y-1/2 w-4 h-4 ${style.bgColor} border-2 ${style.borderColor}
          transform rotate-45
          ${isLeft ? "-right-2 border-l-0 border-b-0" : "-left-2 border-r-0 border-t-0"}
        `}
      />

      {/* 카드 내용 */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <h3 className={`text-xl font-bold ${style.textColor} group-hover:scale-105 transition-transform`}>
            {item.title}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full ${style.badgeBg} whitespace-nowrap ml-2`}>
            {style.badge}
          </span>
        </div>

        {item.description && (
          <p className="text-sm text-gray-600 mb-4">{item.description}</p>
        )}

        {/* 자식 아이템들 */}
        {item.children && item.children.length > 0 && (
          <div className="space-y-2 mt-4 pt-4 border-t border-gray-200">
            {item.children.map((child, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                <Circle className="w-3 h-3 flex-shrink-0 text-gray-400" />
                <span className="font-medium">{child.title}</span>
                {child.description && (
                  <span className="text-xs text-gray-500">- {child.description}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Hover 효과 */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
          style={{ backgroundImage: `linear-gradient(135deg, ${style.dotColor})` }}
        />
      </div>
    </div>
  );
}

// 섹션 헤더
function SectionHeader({ section, index }) {
  const style = levelStyles[section.level] || levelStyles.beginner;

  return (
    <div className="flex items-center justify-center mb-12">
      <div className={`
        relative px-8 py-4 rounded-2xl bg-gradient-to-r ${style.color}
        text-white font-bold text-2xl shadow-xl
        transform hover:scale-105 transition-transform duration-300
      `}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{index + 1}</span>
          <div>
            <div>{section.title}</div>
            <div className="text-sm font-normal opacity-90 mt-1">{style.badge}</div>
          </div>
        </div>

        {/* 장식 요소 */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0
          border-l-[12px] border-l-transparent
          border-r-[12px] border-r-transparent
          border-t-[12px] border-t-white opacity-20"
        />
      </div>
    </div>
  );
}

export default function TimelineRoadmap({ roadmapData }) {
  return (
    <div className="relative max-w-6xl mx-auto py-12">
      {/* 중앙 세로 라인 */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-200 via-emerald-200 to-violet-200 -translate-x-1/2" />

      {/* 로드맵 섹션들 */}
      <div className="relative">
        {roadmapData.children.map((section, sectionIdx) => (
          <div key={section.id} className="mb-16">
            {/* 섹션 헤더 */}
            <SectionHeader section={section} index={sectionIdx} />

            {/* 섹션 아이템들 */}
            <div className="relative">
              {section.children.map((item, itemIdx) => (
                <RoadmapItem
                  key={item.id}
                  item={item}
                  index={itemIdx}
                  isLeft={itemIdx % 2 === 0}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 완료 마커 */}
      <div className="flex items-center justify-center mt-12">
        <div className="relative px-8 py-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold shadow-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6" />
            <span>로드맵 완료!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
