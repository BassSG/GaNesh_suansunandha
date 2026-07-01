import { useEffect, useMemo, useState } from "react";
import { ActivityRail } from "./components/ActivityRail";
import { BottomNav } from "./components/BottomNav";
import { BrandHeader } from "./components/BrandHeader";
import { LearningStage } from "./components/LearningStage";
import { ParentPanel } from "./components/ParentPanel";
import { activities, checklist, examDate, routine } from "./data/learning";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useSpeech } from "./hooks/useSpeech";
import type { ActivityId } from "./types";

type ProgressState = {
  dateKey: string;
  activeActivity: ActivityId;
  stars: number;
  doneTaskIds: Record<string, boolean>;
  taskIndexByActivity: Record<ActivityId, number>;
};

type ChecklistState = Record<string, boolean>;

const initialTaskIndex: Record<ActivityId, number> = {
  listen: 0,
  thai: 0,
  math: 0,
  trace: 0,
  interview: 0
};

function todayKey() {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function getDaysLeft() {
  const now = new Date();
  const exam = new Date(examDate);
  const diff = exam.getTime() - now.getTime();
  return Math.ceil(diff / 86_400_000);
}

function createInitialProgress(): ProgressState {
  return {
    dateKey: todayKey(),
    activeActivity: "listen",
    stars: 0,
    doneTaskIds: {},
    taskIndexByActivity: initialTaskIndex
  };
}

function App() {
  const baseUrl = import.meta.env.BASE_URL;
  const { speak, speaking } = useSpeech();
  const [viewMode, setViewMode] = useState<"home" | "mission" | "stars" | "library" | "parent">("home");
  const [progress, setProgress] = useLocalStorage<ProgressState>("ganesh-ready-progress-v1", createInitialProgress());
  const [checked, setChecked] = useLocalStorage<ChecklistState>("ganesh-ready-checklist-v1", {});

  useEffect(() => {
    if (progress.dateKey === todayKey()) return;
    setProgress({ ...createInitialProgress(), activeActivity: progress.activeActivity });
  }, [progress.activeActivity, progress.dateKey, setProgress]);

  const activeActivity = activities.find((activity) => activity.id === progress.activeActivity) ?? activities[0];
  const activeTaskIndex = progress.taskIndexByActivity[activeActivity.id] ?? 0;
  const activeTask = activeActivity.tasks[activeTaskIndex] ?? activeActivity.tasks[0];

  const progressByActivity = useMemo(() => {
    return activities.reduce((result, activity) => {
      result[activity.id] = activity.tasks.filter((task) => progress.doneTaskIds[task.id]).length;
      return result;
    }, {} as Record<ActivityId, number>);
  }, [progress.doneTaskIds]);

  const completedToday = Object.values(progress.doneTaskIds).filter(Boolean).length;
  const daysLeft = getDaysLeft();

  const handleSelectActivity = (id: ActivityId) => {
    setProgress((current) => ({ ...current, activeActivity: id }));
    setViewMode("home");
  };

  const handleCompleteTask = () => {
    const nextIndex = (activeTaskIndex + 1) % activeActivity.tasks.length;

    setProgress((current) => ({
      ...current,
      stars: Math.min(20, current.stars + 1),
      doneTaskIds: { ...current.doneTaskIds, [activeTask.id]: true },
      taskIndexByActivity: {
        ...current.taskIndexByActivity,
        [activeActivity.id]: nextIndex
      }
    }));

    const nextTask = activeActivity.tasks[nextIndex];
    window.setTimeout(() => {
      speak(`ต่อไป ${nextTask.prompt}`);
    }, 250);
  };

  const handleToggleChecklist = (id: string) => {
    setChecked((current) => ({ ...current, [id]: !current[id] }));
  };

  const parentOpen = viewMode === "parent" || viewMode === "library";

  return (
    <div className="app-shell">
      <BrandHeader
        logoSrc={`${baseUrl}assets/logo.png`}
        daysLeft={daysLeft}
        stars={progress.stars}
        completedToday={completedToday}
        onSpeakIntro={() => speak("วันนี้เราจะฝึกแบบสบาย ๆ ฟังโจทย์ให้จบ แล้วค่อยแตะคำตอบนะกาเนส")}
      />

      <main className="main-grid">
        <section className="mission-column" aria-label="กิจกรรมวันนี้">
          <div className="today-banner">
            <span>⭐</span>
            <div>
              <h2>วันนี้ฝึกอะไรดี</h2>
              <p>{activeActivity.goal}</p>
            </div>
          </div>

          <ActivityRail
            activities={activities}
            activeId={activeActivity.id}
            progressByActivity={progressByActivity}
            onSelect={handleSelectActivity}
          />

          {viewMode === "mission" ? (
            <div className="knowledge-strip">
              <strong>แผน 17 วันสุดท้าย</strong>
              <p>ฝึกสั้นทุกวัน สลับฟังคำสั่ง ภาษาไทย คณิต มัดเล็ก และสัมภาษณ์ ไม่เพิ่มเนื้อหาหนักช่วงใกล้สอบ</p>
            </div>
          ) : null}

          {viewMode === "stars" ? (
            <div className="reward-strip">
              <span>🏆</span>
              <p>สะสมดาวครบ 20 ดวงแล้วปิดท้ายด้วยกิจกรรมที่น้องชอบ</p>
            </div>
          ) : null}
        </section>

        <LearningStage
          activity={activeActivity}
          task={activeTask}
          taskNumber={activeTaskIndex + 1}
          totalTasks={activeActivity.tasks.length}
          speaking={speaking}
          onSpeak={speak}
          onComplete={handleCompleteTask}
        />

        <ParentPanel
          checklist={checklist}
          checked={checked}
          routine={routine}
          open={parentOpen}
          onToggleItem={handleToggleChecklist}
          onClose={() => setViewMode("home")}
        />
      </main>

      <BottomNav activeView={viewMode} onChange={setViewMode} />
    </div>
  );
}

export default App;
