import { useState } from "react";
import { ChevronDown, ChevronRight, Circle } from "lucide-react";

// 재귀적으로 렌더링되는 노드 컴포넌트
function RoadmapNode({ node, level = 0 }) {
  const [isExpanded, setIsExpanded] = useState(level === 0); // 루트는 기본 펼침
  const hasChildren = node.children && node.children.length > 0;

  // 레벨별 스타일
  const getNodeStyle = () => {
    if (level === 0) {
      // 루트 노드 - 큰 그라데이션 박스
      return {
        container: "mb-8",
        box: "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-2xl",
        text: "text-2xl font-bold",
        padding: "p-6",
      };
    } else if (node.level === "beginner" || node.level === "intermediate" || node.level === "advanced") {
      // 주요 카테고리 - 노란색 박스
      return {
        container: "mb-4",
        box: "bg-gradient-to-r from-yellow-300 to-yellow-400 border-2 border-yellow-500 shadow-lg hover:shadow-xl",
        text: "text-lg font-bold text-gray-900",
        padding: "p-4",
      };
    } else {
      // 하위 항목 - 베이지색 박스
      return {
        container: "mb-2",
        box: "bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 shadow hover:shadow-md",
        text: "text-sm font-semibold text-gray-800",
        padding: "p-3",
      };
    }
  };

  const style = getNodeStyle();

  return (
    <div className={style.container} style={{ marginLeft: level > 0 ? `${level * 2}rem` : 0 }}>
      {/* 노드 박스 */}
      <div
        className={`
          ${style.box} ${style.padding}
          rounded-lg transition-all duration-300
          ${hasChildren ? "cursor-pointer" : ""}
          relative group
        `}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {/* 확장/축소 아이콘 */}
            {hasChildren && (
              <div className="flex-shrink-0">
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </div>
            )}

            {!hasChildren && level > 1 && (
              <Circle className="w-3 h-3 flex-shrink-0 opacity-50" />
            )}

            {/* 노드 타이틀 */}
            <div className="flex-1">
              <div className={style.text}>
                {node.title}
              </div>
              {node.description && (
                <div className={`text-xs mt-1 ${level === 0 ? "text-purple-100" : "text-gray-600"}`}>
                  {node.description}
                </div>
              )}
            </div>

            {/* 레벨 뱃지 */}
            {node.level && (
              <div className={`
                text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap
                ${node.level === "beginner" ? "bg-green-500 text-white" : ""}
                ${node.level === "intermediate" ? "bg-blue-500 text-white" : ""}
                ${node.level === "advanced" ? "bg-purple-500 text-white" : ""}
              `}>
                {node.level === "beginner" && "🟢 초급"}
                {node.level === "intermediate" && "🔵 중급"}
                {node.level === "advanced" && "🟣 고급"}
              </div>
            )}
          </div>

          {/* 자식 개수 표시 */}
          {hasChildren && !isExpanded && (
            <div className="ml-3 px-2 py-1 bg-white bg-opacity-30 rounded-full text-xs font-bold">
              {node.children.length}
            </div>
          )}
        </div>

        {/* Hover 효과 */}
        <div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
      </div>

      {/* 자식 노드들 */}
      {hasChildren && isExpanded && (
        <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-300">
          {/* 연결선 */}
          {level > 0 && (
            <div className="absolute left-8 top-12 bottom-0 w-0.5 bg-gradient-to-b from-yellow-400 to-transparent opacity-30" />
          )}

          {node.children.map((child, index) => (
            <RoadmapNode key={child.id || index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function InteractiveRoadmap({ roadmapData }) {
  // 전체 펼치기/접기 상태
  const [expandAll, setExpandAll] = useState(false);

  return (
    <div className="max-w-5xl mx-auto">
      {/* 컨트롤 버튼 */}
      <div className="flex justify-end mb-6 gap-3">
        <button
          onClick={() => setExpandAll(!expandAll)}
          className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors"
        >
          {expandAll ? "전체 접기" : "전체 펼치기"}
        </button>
      </div>

      {/* 로드맵 트리 */}
      <div className="relative">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl opacity-30 -z-10" />

        {/* 루트 노드 */}
        <RoadmapNode
          node={{
            id: "root",
            title: roadmapData.title,
            description: roadmapData.description,
            children: roadmapData.children,
          }}
          level={0}
        />
      </div>

      {/* 안내 메시지 */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> 노란색 박스를 클릭하면 세부 항목이 펼쳐집니다. 계층적으로 학습 경로를 탐색해보세요!
        </p>
      </div>
    </div>
  );
}
