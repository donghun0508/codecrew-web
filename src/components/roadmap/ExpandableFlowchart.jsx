import { useState, useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from "reactflow";
import dagre from "dagre";
import { ChevronDown, ChevronRight } from "lucide-react";
import "reactflow/dist/style.css";

// 커스텀 노드 컴포넌트
function CustomNode({ data }) {
  const { label, level, nodeLevel, hasChildren, isExpanded, onClick, description } = data;

  // 스타일 결정
  const getStyle = () => {
    if (level === 0) {
      // 루트 노드
      return {
        bg: "bg-gradient-to-r from-purple-500 to-indigo-600",
        text: "text-white",
        border: "border-purple-700",
        size: "text-lg font-bold",
      };
    } else if (nodeLevel === "beginner" || nodeLevel === "intermediate" || nodeLevel === "advanced") {
      // 주요 카테고리 - 노란색
      return {
        bg: "bg-gradient-to-r from-yellow-300 to-yellow-400",
        text: "text-gray-900",
        border: "border-yellow-600",
        size: "text-base font-bold",
      };
    } else {
      // 하위 항목 - 베이지색
      return {
        bg: "bg-gradient-to-r from-orange-100 to-amber-100",
        text: "text-gray-800",
        border: "border-orange-300",
        size: "text-sm font-semibold",
      };
    }
  };

  const style = getStyle();

  return (
    <div
      className={`
        ${style.bg} ${style.text}
        px-4 py-3 rounded-lg border-2 ${style.border}
        shadow-lg hover:shadow-xl transition-all duration-200
        ${hasChildren ? "cursor-pointer" : ""}
        min-w-[180px] max-w-[250px]
      `}
      onClick={onClick}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />

      <div className="flex items-center gap-2">
        {hasChildren && (
          <div className="flex-shrink-0">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        )}

        <div className="flex-1">
          <div className={style.size}>{label}</div>
          {description && level === 0 && (
            <div className="text-xs mt-1 opacity-90">{description}</div>
          )}
        </div>

        {nodeLevel && (
          <div className={`
            text-xs px-2 py-0.5 rounded-full font-bold whitespace-nowrap flex-shrink-0
            ${nodeLevel === "beginner" ? "bg-green-500 text-white" : ""}
            ${nodeLevel === "intermediate" ? "bg-blue-500 text-white" : ""}
            ${nodeLevel === "advanced" ? "bg-purple-500 text-white" : ""}
          `}>
            {nodeLevel === "beginner" && "🟢"}
            {nodeLevel === "intermediate" && "🔵"}
            {nodeLevel === "advanced" && "🟣"}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}

const nodeTypes = {
  custom: CustomNode,
};

// dagre 레이아웃 적용
const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "TB", nodesep: 120, ranksep: 100 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 220, height: 80 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 110,
        y: nodeWithPosition.y - 40,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export default function ExpandableFlowchart({ roadmapData }) {
  // 각 노드의 확장 상태 관리
  const [expandedNodes, setExpandedNodes] = useState(new Set(["root"]));

  // 노드 확장/축소 토글
  const toggleNode = useCallback((nodeId) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  // 노드와 엣지 생성
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes = [];
    const edges = [];
    let nodeIdCounter = 0;

    function processNode(node, parentId = null, level = 0) {
      const nodeId = parentId ? `${parentId}-${nodeIdCounter++}` : "root";
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedNodes.has(nodeId);

      // 노드 생성
      nodes.push({
        id: nodeId,
        type: "custom",
        data: {
          label: node.title,
          description: node.description,
          level,
          nodeLevel: node.level,
          hasChildren,
          isExpanded,
          onClick: hasChildren ? () => toggleNode(nodeId) : undefined,
        },
        position: { x: 0, y: 0 }, // dagre가 계산
      });

      // 부모와 연결
      if (parentId) {
        const edgeColor = node.level === "beginner"
          ? "#f59e0b"
          : node.level === "intermediate"
          ? "#10b981"
          : node.level === "advanced"
          ? "#8b5cf6"
          : "#94a3b8";

        edges.push({
          id: `${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: "smoothstep",
          animated: false,
          style: {
            stroke: edgeColor,
            strokeWidth: 2,
          },
        });
      }

      // 확장된 경우에만 자식 처리
      if (hasChildren && isExpanded) {
        node.children.forEach((child) => {
          processNode(child, nodeId, level + 1);
        });
      }
    }

    // 루트 노드부터 시작
    processNode({
      id: "root",
      title: roadmapData.title,
      description: roadmapData.description,
      children: roadmapData.children,
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [roadmapData, expandedNodes, toggleNode]);

  // 레이아웃 적용
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    return getLayoutedElements(initialNodes, initialEdges);
  }, [initialNodes, initialEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  // 전체 펼치기/접기
  const expandAll = useCallback(() => {
    const allNodeIds = new Set();

    function collectIds(node, parentId = null) {
      const nodeId = parentId ? `${parentId}-${node.id}` : "root";
      allNodeIds.add(nodeId);
      if (node.children) {
        node.children.forEach((child) => collectIds(child, nodeId));
      }
    }

    collectIds({
      id: "root",
      title: roadmapData.title,
      children: roadmapData.children,
    });

    setExpandedNodes(allNodeIds);
  }, [roadmapData]);

  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set(["root"]));
  }, []);

  return (
    <div className="w-full">
      {/* 컨트롤 버튼 */}
      <div className="flex justify-end mb-4 gap-3">
        <button
          onClick={collapseAll}
          className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:border-red-400 hover:text-red-600 transition-colors"
        >
          전체 접기
        </button>
        <button
          onClick={expandAll}
          className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors"
        >
          전체 펼치기
        </button>
      </div>

      {/* 플로우차트 */}
      <div className="w-full h-[800px] border-2 border-border rounded-lg bg-gradient-to-br from-slate-50 to-slate-100">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
          minZoom={0.3}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#cbd5e1" gap={20} size={1} style={{ opacity: 0.4 }} />
          <Controls />
        </ReactFlow>
      </div>

      {/* 안내 */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> 노란색 박스를 클릭하면 하위 항목들이 나타납니다. 플로우차트를 드래그하거나 줌할 수 있어요!
        </p>
      </div>
    </div>
  );
}
