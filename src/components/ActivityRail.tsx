import { Check } from "lucide-react";
import type { CSSProperties } from "react";
import type { Activity, ActivityId } from "../types";

type ActivityRailProps = {
  activities: Activity[];
  activeId: ActivityId;
  progressByActivity: Record<ActivityId, number>;
  onSelect: (id: ActivityId) => void;
};

export function ActivityRail({ activities, activeId, progressByActivity, onSelect }: ActivityRailProps) {
  return (
    <nav className="activity-rail" aria-label="เลือกกิจกรรม">
      {activities.map((activity) => {
        const isActive = activity.id === activeId;
        const progress = progressByActivity[activity.id] ?? 0;
        const done = progress >= activity.tasks.length;

        return (
          <button
            key={activity.id}
            type="button"
            className={`activity-card ${isActive ? "is-active" : ""}`}
            style={{ "--activity-color": activity.color, "--activity-accent": activity.accent } as CSSProperties}
            onClick={() => onSelect(activity.id)}
          >
            <span className="activity-number">{activity.order}</span>
            {done ? (
              <span className="activity-check">
                <Check size={22} />
              </span>
            ) : null}
            <span className="activity-emoji" aria-hidden="true">
              {activity.emoji}
            </span>
            <strong>{activity.shortTitle}</strong>
            <small>
              {Math.min(progress + 1, activity.tasks.length)}/{activity.tasks.length}
            </small>
          </button>
        );
      })}
    </nav>
  );
}
