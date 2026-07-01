import { Eraser, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { TraceTask } from "../types";

type TracePadProps = {
  task: TraceTask;
  onDone: () => void;
};

export function TracePad({ task, onDone }: TracePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const [strokes, setStrokes] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;
    context.scale(scale, scale);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 8;
    context.strokeStyle = "#087d73";
  }, [task.id]);

  const pointer = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const context = event.currentTarget.getContext("2d");
    if (!context) return;
    const point = pointer(event);
    drawing.current = true;
    context.beginPath();
    context.moveTo(point.x, point.y);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const context = event.currentTarget.getContext("2d");
    if (!context) return;
    const point = pointer(event);
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = false;
    setStrokes((count) => count + 1);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const reset = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes(0);
  };

  return (
    <div className="trace-pad">
      <div className={`trace-guide trace-${task.guide}`} aria-hidden="true">
        <span className="trace-start">🐟</span>
        <span className="trace-end">⭐</span>
      </div>
      <canvas
        ref={canvasRef}
        aria-label="พื้นที่ลากเส้น"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
      <div className="trace-actions">
        <button type="button" className="small-tool" onClick={reset}>
          <RotateCcw size={20} />
          <span>เริ่มใหม่</span>
        </button>
        <button type="button" className="small-tool" onClick={reset}>
          <Eraser size={20} />
          <span>ล้าง</span>
        </button>
        <button type="button" className="complete-button" onClick={onDone} disabled={strokes < 1}>
          เสร็จแล้ว
        </button>
      </div>
    </div>
  );
}
