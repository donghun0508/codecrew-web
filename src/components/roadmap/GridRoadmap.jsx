import { Circle } from "lucide-react";

// 우선순위/상태별 색상
const priorityColors = {
  beginner: {
    dot: "bg-amber-400",
    text: "text-amber-600",
    label: "🟡 초급",
  },
  intermediate: {
    dot: "bg-blue-400",
    text: "text-blue-600",
    label: "🔵 중급",
  },
  advanced: {
    dot: "bg-purple-400",
    text: "text-purple-600",
    label: "🟣 고급",
  },
};

// 그리드 아이템
function GridItem({ item }) {
  const priority = priorityColors[item.level] || priorityColors.beginner;

  return (
    <div className="flex items-start gap-2 py-2 px-3 hover:bg-gray-50 rounded transition-colors group">
      <div className={`w-2 h-2 ${priority.dot} rounded-full mt-1.5 flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-900 group-hover:text-primary transition-colors">
          {item.title}
        </div>
        {item.description && (
          <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
        )}
      </div>
    </div>
  );
}

// 섹션 컬럼
function SectionColumn({ section, index }) {
  const colors = [
    "from-red-500 to-red-600",
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-green-500 to-green-600",
  ];

  return (
    <div className="flex-1 min-w-[250px] border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* 헤더 */}
      <div className={`bg-gradient-to-r ${colors[index % colors.length]} text-white p-4`}>
        <h3 className="font-bold text-lg">{section.title}</h3>
        {section.level && (
          <div className="text-xs mt-1 opacity-90">
            {priorityColors[section.level]?.label}
          </div>
        )}
      </div>

      {/* 아이템 리스트 */}
      <div className="p-2 space-y-1">
        {section.children && section.children.length > 0 ? (
          section.children.map((item, idx) => <GridItem key={idx} item={item} />)
        ) : (
          <div className="text-sm text-gray-400 text-center py-4">항목 없음</div>
        )}
      </div>
    </div>
  );
}

export default function GridRoadmap({ roadmapData }) {
  return (
    <div className="w-full">
      {/* 범례 */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-6 flex-wrap">
          <span className="text-sm font-semibold text-gray-700">레벨:</span>
          {Object.entries(priorityColors).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-3 h-3 ${value.dot} rounded-full`} />
              <span className="text-sm text-gray-600">{value.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 그리드 레이아웃 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {roadmapData.children && roadmapData.children.map((section, index) => (
          <SectionColumn key={section.id || index} section={section} index={index} />
        ))}
      </div>

      {/* 안내 */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> 각 컬럼은 주요 카테고리를 나타내며, 색상별 점은 난이도를 표시합니다.
        </p>
      </div>
    </div>
  );
}
