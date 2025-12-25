import { Code, Database, Cloud, Cpu, Zap, Rocket, Star, CheckCircle } from "lucide-react";

// 아이콘 매핑
const iconMap = {
  Code,
  Database,
  Cloud,
  Cpu,
  Zap,
  Rocket,
  Star,
  CheckCircle,
};

// 레벨별 색상
const levelColors = {
  beginner: {
    primary: "#10b981", // green
    secondary: "#d1fae5",
    gradient: "from-green-400 to-emerald-500",
  },
  intermediate: {
    primary: "#3b82f6", // blue
    secondary: "#dbeafe",
    gradient: "from-blue-400 to-indigo-500",
  },
  advanced: {
    primary: "#8b5cf6", // purple
    secondary: "#ede9fe",
    gradient: "from-purple-400 to-violet-500",
  },
};

// 개별 로드맵 아이템
function RoadmapItem({ item, index, isLeft }) {
  const color = levelColors[item.level] || levelColors.beginner;
  const IconComponent = iconMap[item.icon] || Code;

  return (
    <div className={`flex items-center gap-8 mb-16 ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
      {/* 설명 카드 */}
      <div className="flex-1">
        <div
          className={`
            relative p-6 rounded-2xl shadow-lg border-2 transition-all duration-300
            hover:shadow-2xl hover:-translate-y-1 cursor-pointer
            bg-white
          `}
          style={{ borderColor: color.primary }}
        >
          {/* 화살표 */}
          <div
            className={`
              absolute top-1/2 -translate-y-1/2 w-0 h-0
              ${isLeft ? "-right-4" : "-left-4"}
            `}
            style={{
              borderTop: "16px solid transparent",
              borderBottom: "16px solid transparent",
              [isLeft ? "borderLeft" : "borderRight"]: `16px solid ${color.primary}`,
            }}
          />

          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${color.gradient} text-white`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              )}
              {item.level && (
                <span
                  className={`inline-block text-xs px-3 py-1 rounded-full font-semibold`}
                  style={{ backgroundColor: color.secondary, color: color.primary }}
                >
                  {item.level === "beginner" && "🟢 초급"}
                  {item.level === "intermediate" && "🔵 중급"}
                  {item.level === "advanced" && "🟣 고급"}
                </span>
              )}

              {/* 자식 항목들 */}
              {item.children && item.children.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                  {item.children.map((child, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      <span>{child.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 중앙 마커 */}
      <div className="relative flex-shrink-0">
        <div
          className={`
            w-16 h-16 rounded-full bg-gradient-to-br ${color.gradient}
            flex items-center justify-center text-white font-bold text-xl
            shadow-xl border-4 border-white z-10 relative
          `}
        >
          {index + 1}
        </div>
      </div>

      {/* 빈 공간 */}
      <div className="flex-1" />
    </div>
  );
}

export default function RoadPathRoadmap({ roadmapData }) {
  // 모든 아이템 평탄화
  const allItems = [];
  roadmapData.children.forEach((section) => {
    if (section.children) {
      section.children.forEach((item) => {
        allItems.push({
          ...item,
          level: section.level || item.level,
          icon: getIconForItem(item.title),
        });
      });
    } else {
      allItems.push({
        ...section,
        icon: getIconForItem(section.title),
      });
    }
  });

  return (
    <div className="relative max-w-6xl mx-auto py-12">
      {/* SVG 경로 배경 */}
      <svg
        className="absolute left-1/2 top-0 -translate-x-1/2 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <defs>
          <linearGradient id="roadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#10b981", stopOpacity: 0.6 }} />
            <stop offset="50%" style={{ stopColor: "#3b82f6", stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: "#8b5cf6", stopOpacity: 0.6 }} />
          </linearGradient>
        </defs>

        {/* 구불구불한 경로 */}
        <path
          d={`M ${window.innerWidth / 2} 0 ${generatePath(allItems.length)}`}
          fill="none"
          stroke="url(#roadGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="20,10"
          opacity="0.3"
        />
      </svg>

      {/* 로드맵 아이템들 */}
      <div className="relative" style={{ zIndex: 1 }}>
        {allItems.map((item, index) => (
          <RoadmapItem
            key={index}
            item={item}
            index={index}
            isLeft={index % 2 === 0}
          />
        ))}
      </div>

      {/* 완료 마커 */}
      <div className="flex items-center justify-center mt-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white shadow-2xl border-4 border-white">
            <CheckCircle className="w-12 h-12" />
          </div>
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="text-lg font-bold text-gray-700">완료!</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 아이템 제목에 따라 아이콘 할당
function getIconForItem(title) {
  const titleLower = title.toLowerCase();
  if (titleLower.includes("html") || titleLower.includes("css") || titleLower.includes("javascript")) return "Code";
  if (titleLower.includes("react") || titleLower.includes("vue") || titleLower.includes("angular")) return "Zap";
  if (titleLower.includes("database") || titleLower.includes("sql") || titleLower.includes("mongo")) return "Database";
  if (titleLower.includes("cloud") || titleLower.includes("aws") || titleLower.includes("docker")) return "Cloud";
  if (titleLower.includes("ai") || titleLower.includes("ml") || titleLower.includes("python")) return "Cpu";
  if (titleLower.includes("advanced") || titleLower.includes("최신") || titleLower.includes("트렌드")) return "Rocket";
  return "Star";
}

// SVG 경로 생성 (구불구불한 경로)
function generatePath(itemCount) {
  let path = "";
  const height = itemCount * 200; // 각 아이템당 높이
  const width = 400;
  const centerX = window.innerWidth / 2;

  for (let i = 1; i <= itemCount; i++) {
    const y = i * 200;
    const x = i % 2 === 0 ? centerX + width / 2 : centerX - width / 2;
    const prevX = (i - 1) % 2 === 0 ? centerX - width / 2 : centerX + width / 2;
    const prevY = (i - 1) * 200;

    // 곡선으로 연결
    const controlX1 = prevX;
    const controlY1 = prevY + 100;
    const controlX2 = x;
    const controlY2 = y - 100;

    path += `C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${x} ${y} `;
  }

  return path;
}
