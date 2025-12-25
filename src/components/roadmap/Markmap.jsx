import { useEffect, useRef } from "react";
import { Transformer } from "markmap-lib";
import { Markmap } from "markmap-view";

export default function MarkmapComponent({ markdown }) {
  const svgRef = useRef(null);
  const markmapRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || !markdown) return;

    // 마크다운을 markmap 데이터로 변환
    const transformer = new Transformer();
    const { root } = transformer.transform(markdown);

    // Markmap 인스턴스 생성 또는 업데이트
    if (!markmapRef.current) {
      markmapRef.current = Markmap.create(svgRef.current, {
        // 스타일 옵션
        duration: 500,
        maxWidth: 300,
        color: (node) => {
          // 레벨별 색상 지정
          const colors = [
            "#3b82f6", // blue-500
            "#10b981", // green-500
            "#f59e0b", // amber-500
            "#ef4444", // red-500
            "#8b5cf6", // violet-500
            "#ec4899", // pink-500
          ];
          return colors[node.depth % colors.length];
        },
      });
    }

    // 데이터 업데이트
    markmapRef.current.setData(root);
    markmapRef.current.fit();
  }, [markdown]);

  return (
    <div className="w-full h-[600px] border-2 border-border rounded-lg bg-card">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
