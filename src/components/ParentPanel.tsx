import { Check, ClipboardCheck, Heart, X } from "lucide-react";
import type { Activity, ActivityId, ChecklistItem, LearnerProfile, RoutineStep } from "../types";

type ParentPanelProps = {
  checklist: ChecklistItem[];
  checked: Record<string, boolean>;
  routine: RoutineStep[];
  activities: Activity[];
  activeProfile: LearnerProfile;
  progressByActivity: Record<ActivityId, number>;
  totalByActivity: Record<ActivityId, number>;
  completedToday: number;
  mistakeCount: number;
  dailyPlanCompleted: number;
  dailyPlanTotal: number;
  open: boolean;
  onToggleItem: (id: string) => void;
  onClose: () => void;
};

export function ParentPanel({
  checklist,
  checked,
  routine,
  activities,
  activeProfile,
  progressByActivity,
  totalByActivity,
  completedToday,
  mistakeCount,
  dailyPlanCompleted,
  dailyPlanTotal,
  open,
  onToggleItem,
  onClose
}: ParentPanelProps) {
  const checkedCount = checklist.filter((item) => checked[item.id]).length;
  const attempts = completedToday + mistakeCount;
  const accuracy = attempts > 0 ? Math.round((completedToday / attempts) * 100) : 100;
  const weakestActivity = activities
    .map((activity) => ({
      activity,
      done: progressByActivity[activity.id] ?? 0,
      total: totalByActivity[activity.id] ?? activity.tasks.length
    }))
    .sort((a, b) => a.done / a.total - b.done / b.total)[0];
  const parentTip =
    mistakeCount > 0
      ? "มีข้อที่ลองผิดอยู่ กลับไปฟังโจทย์ช้า ๆ แล้วให้ชี้ภาพก่อนตอบ"
      : dailyPlanCompleted < dailyPlanTotal
        ? "ทำแผนวันนี้ให้ครบก่อน แล้วค่อยเล่นอิสระ"
        : "วันนี้พอแล้ว ปิดท้ายด้วยคำชมและพักสายตา";

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

      <div className="practice-report">
        <div className="report-head">
          <span>รายงานของ {activeProfile.label}</span>
          <strong>แผน {dailyPlanCompleted}/{dailyPlanTotal}</strong>
        </div>
        <div className="report-metrics">
          <div>
            <span>ทำแล้ว</span>
            <strong>{completedToday}</strong>
          </div>
          <div>
            <span>ความแม่น</span>
            <strong>{accuracy}%</strong>
          </div>
          <div>
            <span>ลองผิด</span>
            <strong>{mistakeCount}</strong>
          </div>
        </div>
        <div className="activity-report-list">
          {activities.map((activity) => {
            const done = progressByActivity[activity.id] ?? 0;
            const total = totalByActivity[activity.id] ?? activity.tasks.length;
            return (
              <div key={activity.id}>
                <span style={{ background: activity.color }}>{activity.order}</span>
                <strong>{activity.shortTitle}</strong>
                <small>{done}/{total}</small>
              </div>
            );
          })}
        </div>
        <div className="parent-tip">
          <b>ควรเน้นต่อ</b>
          <span>{weakestActivity?.activity.shortTitle}: {parentTip}</span>
        </div>
      </div>

      <div className="checklist">
        {checklist.map((item) => (
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
