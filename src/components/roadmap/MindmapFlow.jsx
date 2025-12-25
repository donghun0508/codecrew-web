import { useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";

// dagre를 사용한 자동 레이아웃
const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 200;
  const nodeHeight = 80;

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 100,
    ranksep: 150,
    marginx: 50,
    marginy: 50,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
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
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

// 트리 데이터를 React Flow 노드/엣지로 변환
function convertTreeToFlow(treeData) {
  const nodes = [];
  const edges = [];
  let nodeId = 0;

  // 레벨별 스타일
  const getLevelStyle = (level, nodeLevel) => {
    // 루트 노드
    if (level === 0) {
      return {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        border: "3px solid #5a67d8",
        fontSize: "16px",
        fontWeight: "700",
      };
    }

    // 레벨 뱃지에 따른 색상
    if (nodeLevel === "beginner") {
      return {
        background: "#fef3c7",
        color: "#92400e",
        border: "2px solid #f59e0b",
        fontSize: "14px",
        fontWeight: "600",
      };
    } else if (nodeLevel === "intermediate") {
      return {
        background: "#d1fae5",
        color: "#065f46",
        border: "2px solid #10b981",
        fontSize: "14px",
        fontWeight: "600",
      };
    } else if (nodeLevel === "advanced") {
      return {
        background: "#ddd6fe",
        color: "#5b21b6",
        border: "2px solid #8b5cf6",
        fontSize: "14px",
        fontWeight: "600",
      };
    }

    // 기본
    return {
      background: "#fff",
      color: "#1f2937",
      border: "2px solid #d1d5db",
      fontSize: "14px",
      fontWeight: "500",
    };
  };

  // 재귀적으로 노드 생성
  function processNode(node, parentId = null, level = 0) {
    const id = `node-${nodeId++}`;
    const style = getLevelStyle(level, node.level);

    // 노드 생성
    const nodeData = {
      id,
      type: "default",
      data: {
        label: (
          <div className="text-center px-2 py-1">
            <div style={{ fontWeight: style.fontWeight, fontSize: style.fontSize }}>
              {node.title}
            </div>
            {node.description && level > 0 && (
              <div className="text-xs opacity-75 mt-1">{node.description}</div>
            )}
            {node.level && (
              <div className="text-xs mt-1">
                {node.level === "beginner" && "🟡 초급"}
                {node.level === "intermediate" && "🟢 중급"}
                {node.level === "advanced" && "🔵 고급"}
              </div>
            )}
          </div>
        ),
      },
      position: { x: 0, y: 0 }, // dagre가 계산함
      style: {
        background: style.background,
        color: style.color,
        border: style.border,
        borderRadius: "8px",
        padding: "16px 20px",
        minWidth: "180px",
        boxShadow: level === 0
          ? "0 10px 25px rgba(0, 0, 0, 0.2)"
          : "0 4px 10px rgba(0, 0, 0, 0.1)",
      },
    };

    nodes.push(nodeData);

    // 부모와 연결
    if (parentId !== null) {
      const edgeStyle = node.level === "beginner"
        ? { stroke: "#f59e0b", strokeWidth: 2 }
        : node.level === "intermediate"
        ? { stroke: "#10b981", strokeWidth: 2 }
        : node.level === "advanced"
        ? { stroke: "#8b5cf6", strokeWidth: 2 }
        : { stroke: "#9ca3af", strokeWidth: 2 };

      edges.push({
        id: `edge-${parentId}-${id}`,
        source: parentId,
        target: id,
        type: "smoothstep",
        animated: false,
        style: edgeStyle,
      });
    }

    // 자식 노드 처리
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        processNode(child, id, level + 1);
      });
    }
  }

  // 루트 노드부터 시작
  processNode(treeData);

  return { nodes, edges };
}

export default function MindmapFlow({ roadmapData }) {
  // 노드와 엣지 생성 + 레이아웃 계산
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    // 루트 노드 생성
    const rootNode = {
      id: "root",
      title: roadmapData.title,
      description: roadmapData.description,
      children: roadmapData.children,
    };

    // 노드/엣지 생성
    const { nodes: rawNodes, edges: rawEdges } = convertTreeToFlow(rootNode);

    // dagre로 레이아웃 계산
    return getLayoutedElements(rawNodes, rawEdges, "TB");
  }, [roadmapData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => [...eds, params]),
    [setEdges]
  );

  return (
    <div className="w-full h-[800px] border-2 border-border rounded-lg bg-gradient-to-br from-slate-50 to-slate-100">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="bottom-right"
        minZoom={0.3}
        maxZoom={1.2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color="#cbd5e1"
          gap={20}
          size={1}
          style={{ opacity: 0.4 }}
        />
        <Controls
          showInteractive={false}
          style={{
            button: {
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
            },
          }}
        />
        <MiniMap
          nodeColor={(node) => {
            const bgColor = node.style?.background;
            if (typeof bgColor === "string" && bgColor.includes("gradient")) {
              return "#667eea";
            }
            return bgColor || "#fff";
          }}
          maskColor="rgba(0, 0, 0, 0.05)"
          style={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e5e7eb",
          }}
        />
      </ReactFlow>
    </div>
  );
}
