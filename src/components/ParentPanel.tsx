import { Check, ClipboardCheck, Heart, X } from "lucide-react";
import type { ChecklistItem, RoutineStep } from "../types";

type ParentPanelProps = {
  checklist: ChecklistItem[];
  checked: Record<string, boolean>;
  routine: RoutineStep[];
  open: boolean;
  onToggleItem: (id: string) => void;
  onClose: () => void;
};

export function ParentPanel({ checklist, checked, routine, open, onToggleItem, onClose }: ParentPanelProps) {
  const checkedCount = checklist.filter((item) => checked[item.id]).length;

  return (
    <aside className={`parent-panel ${open ? "is-open" : ""}`} aria-label="สำหรับผู้ปกครอง">
      <div className="panel-head">
        <ClipboardCheck size={26} />
        <strong>สำหรับผู้ปกครอง</strong>
        <button type="button" className="panel-close" onClick={onClose} aria-label="ปิดแผงผู้ปกครอง">
          <X size={24} />
        </button>
      </div>

      <div className="mini-summary">
        <span>เช็กลิสต์ก่อนสอบ</span>
        <strong>{checkedCount}/{checklist.length}</strong>
      </div>

      <div className="checklist">
        {checklist.slice(0, 6).map((item) => (
          <button key={item.id} type="button" className="check-row" onClick={() => onToggleItem(item.id)}>
            <span className="check-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
            <span className={`round-check ${checked[item.id] ? "is-done" : ""}`}>
              {checked[item.id] ? <Check size={18} /> : null}
            </span>
          </button>
        ))}
      </div>

      <div className="routine-box">
        <strong>ตาราง 30 นาที</strong>
        {routine.map((step) => (
          <div className="routine-row" key={step.title}>
            <span>{step.minutes} นาที</span>
            <p>
              <b>{step.title}</b> {step.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="parent-note">
        <Heart size={24} fill="#ff8aa0" />
        <p>ยิ้ม พูดคุย รับฟัง ชื่นชมความพยายามก่อนผลลัพธ์</p>
      </div>
    </aside>
  );
}
