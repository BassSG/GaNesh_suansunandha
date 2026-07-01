import { useEffect, useMemo, useState } from "react";
import { ActivityRail } from "./components/ActivityRail";
import { BottomNav } from "./components/BottomNav";
import { BrandHeader } from "./components/BrandHeader";
import { LearningStage } from "./components/LearningStage";
import { ParentPanel } from "./components/ParentPanel";
import { activities, checklist, dailyPlan, examDate, routine } from "./data/learning";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useSpeech } from "./hooks/useSpeech";
import type { Activity, ActivityId, LearnerId, LearnerProfile, ProgressState } from "./types";

type ChecklistState = Record<string, boolean>;
type ProgressByProfile = Record<LearnerId, ProgressState>;

const learnerProfiles: LearnerProfile[] = [
  { id: "ganesh", label: "กาเนส", emoji: "😊" },
  { id: "papa", label: "ปะป๊า", emoji: "🧑" }
];

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

function createInitialProgress(activeActivity: ActivityId = "listen"): ProgressState {
  return {
    dateKey: todayKey(),
    activeActivity,
    practiceMode: "free",
    stars: 0,
    doneTaskIds: {},
    mistakesByTaskId: {},
    taskIndexByActivity: { ...initialTaskIndex }
  };
}

function createInitialProgressByProfile(): ProgressByProfile {
  return {
    ganesh: createInitialProgress(),
    papa: createInitialProgress()
  };
}

function getFirstOpenTaskIndex(activity: Activity, doneTaskIds: Record<string, boolean>) {
  const openIndex = activity.tasks.findIndex((task) => !doneTaskIds[task.id]);
  return openIndex >= 0 ? openIndex : 0;
}

function normalizeProgress(progress?: Partial<ProgressState>): ProgressState {
  return {
    dateKey: progress?.dateKey ?? todayKey(),
    activeActivity: progress?.activeActivity ?? "listen",
    practiceMode: progress?.practiceMode ?? "free",
    stars: progress?.stars ?? 0,
    doneTaskIds: progress?.doneTaskIds ?? {},
    mistakesByTaskId: progress?.mistakesByTaskId ?? {},
    taskIndexByActivity: { ...initialTaskIndex, ...progress?.taskIndexByActivity }
  };
}

function countDoneForActivity(activity: Activity, doneTaskIds: Record<string, boolean>) {
  return activity.tasks.filter((task) => doneTaskIds[task.id]).length;
}

function getDailyPlanStatus(doneTaskIds: Record<string, boolean>) {
  const rows = dailyPlan.map((item) => {
    const activity = activities.find((candidate) => candidate.id === item.activityId) ?? activities[0];
    const done = Math.min(item.target, countDoneForActivity(activity, doneTaskIds));
    return { ...item, activity, done };
  });
  const total = rows.reduce((sum, row) => sum + row.target, 0);
  const completed = rows.reduce((sum, row) => sum + row.done, 0);
  const nextRow = rows.find((row) => row.done < row.target);
  return { rows, total, completed, nextActivityId: nextRow?.activityId ?? null };
}

function App() {
  const baseUrl = import.meta.env.BASE_URL;
  const { speak, speaking } = useSpeech();
  const [viewMode, setViewMode] = useState<"home" | "mission" | "stars" | "library" | "parent">("home");
  const [activeProfile, setActiveProfile] = useLocalStorage<LearnerId>("ganesh-ready-active-profile-v1", "ganesh");
  const [autoSpeak, setAutoSpeak] = useLocalStorage<boolean>("ganesh-ready-auto-speak-v1", true);
  const [progressByProfile, setProgressByProfile] = useLocalStorage<ProgressByProfile>(
    "ganesh-ready-progress-by-profile-v2",
    createInitialProgressByProfile()
  );
  const [checked, setChecked] = useLocalStorage<ChecklistState>("ganesh-ready-checklist-v1", {});
  const activeProfileInfo = learnerProfiles.find((profile) => profile.id === activeProfile) ?? learnerProfiles[0];
  const progress = normalizeProgress(progressByProfile[activeProfile]);

  useEffect(() => {
    if (progress.dateKey === todayKey()) return;
    setProgressByProfile((current) => ({
      ...current,
      [activeProfile]: createInitialProgress(progress.activeActivity)
    }));
  }, [activeProfile, progress.activeActivity, progress.dateKey, setProgressByProfile]);

  const activeActivity = activities.find((activity) => activity.id === progress.activeActivity) ?? activities[0];
  const activeTaskIndex = progress.taskIndexByActivity[activeActivity.id] ?? 0;
  const activeTask = activeActivity.tasks[activeTaskIndex] ?? activeActivity.tasks[0];

  const progressByActivity = useMemo(() => {
    return activities.reduce((result, activity) => {
      result[activity.id] = activity.tasks.filter((task) => progress.doneTaskIds[task.id]).length;
      return result;
    }, {} as Record<ActivityId, number>);
  }, [progress.doneTaskIds]);

  const totalByActivity = useMemo(() => {
    return activities.reduce((result, activity) => {
      result[activity.id] = activity.tasks.length;
      return result;
    }, {} as Record<ActivityId, number>);
  }, []);

  const dailyPlanStatus = useMemo(() => getDailyPlanStatus(progress.doneTaskIds), [progress.doneTaskIds]);
  const completedToday = Object.values(progress.doneTaskIds).filter(Boolean).length;
  const mistakeCount = Object.values(progress.mistakesByTaskId).reduce((sum, count) => sum + count, 0);
  const daysLeft = getDaysLeft();

  const updateProgress = (updater: (current: ProgressState) => ProgressState) => {
    setProgressByProfile((current) => {
      const currentProgress = normalizeProgress(current[activeProfile]);
      return {
        ...current,
        [activeProfile]: updater(currentProgress)
      };
    });
  };

  const handleSelectActivity = (id: ActivityId) => {
    const selectedActivity = activities.find((activity) => activity.id === id) ?? activities[0];
    updateProgress((current) => ({
      ...current,
      activeActivity: id,
      practiceMode: "free",
      taskIndexByActivity: {
        ...current.taskIndexByActivity,
        [id]: current.taskIndexByActivity[id] ?? getFirstOpenTaskIndex(selectedActivity, current.doneTaskIds)
      }
    }));
    setViewMode("home");
  };

  const handleSelectProfile = (id: LearnerId) => {
    setActiveProfile(id);
    setViewMode("home");
  };

  const handleResetProfile = () => {
    setProgressByProfile((current) => ({
      ...current,
      [activeProfile]: createInitialProgress()
    }));
    speak(`ล้างผลของ ${activeProfileInfo.label} แล้ว เริ่มใหม่ได้เลย`);
    setViewMode("home");
  };

  const handleToggleAutoSpeak = () => {
    const nextAutoSpeak = !autoSpeak;
    setAutoSpeak(nextAutoSpeak);
    speak(nextAutoSpeak ? "เปิดอ่านโจทย์อัตโนมัติแล้ว" : "ปิดอ่านโจทย์อัตโนมัติแล้ว");
  };

  const handleStartDailyPlan = () => {
    const nextActivityId = dailyPlanStatus.nextActivityId;
    if (!nextActivityId) {
      speak("แผนวันนี้ครบแล้ว พักได้เลย");
      return;
    }

    const nextActivity = activities.find((activity) => activity.id === nextActivityId) ?? activities[0];
    const nextIndex = getFirstOpenTaskIndex(nextActivity, progress.doneTaskIds);
    updateProgress((current) => ({
      ...current,
      activeActivity: nextActivity.id,
      practiceMode: "daily",
      taskIndexByActivity: {
        ...current.taskIndexByActivity,
        [nextActivity.id]: nextIndex
      }
    }));
    setViewMode("home");
    speak(`เริ่มแผนวันนี้ ฐานแรก ${nextActivity.title} ${nextActivity.tasks[nextIndex]?.prompt ?? ""}`);
  };

  const handleMistake = (taskId: string) => {
    updateProgress((current) => ({
      ...current,
      mistakesByTaskId: {
        ...current.mistakesByTaskId,
        [taskId]: (current.mistakesByTaskId[taskId] ?? 0) + 1
      }
    }));
  };

  const handleCompleteTask = () => {
    const activityIndex = activities.findIndex((activity) => activity.id === activeActivity.id);
    const isLastTaskInActivity = activeTaskIndex >= activeActivity.tasks.length - 1;
    const completedTaskIds = { ...progress.doneTaskIds, [activeTask.id]: true };
    const alreadyDone = Boolean(progress.doneTaskIds[activeTask.id]);
    const nextDailyActivityId = progress.practiceMode === "daily" ? getDailyPlanStatus(completedTaskIds).nextActivityId : null;
    const nextActivity = nextDailyActivityId
      ? activities.find((activity) => activity.id === nextDailyActivityId) ?? activeActivity
      : isLastTaskInActivity
        ? activities[(activityIndex + 1) % activities.length]
        : activeActivity;
    const nextIndex = nextDailyActivityId
      ? getFirstOpenTaskIndex(nextActivity, completedTaskIds)
      : isLastTaskInActivity
        ? getFirstOpenTaskIndex(nextActivity, completedTaskIds)
        : activeTaskIndex + 1;
    const nextTask = nextActivity.tasks[nextIndex] ?? nextActivity.tasks[0];
    const dailyPlanComplete = progress.practiceMode === "daily" && !nextDailyActivityId;

    updateProgress((current) => ({
      ...current,
      activeActivity: nextActivity.id,
      practiceMode: dailyPlanComplete ? "free" : current.practiceMode,
      stars: alreadyDone ? current.stars : Math.min(20, current.stars + 1),
      doneTaskIds: { ...current.doneTaskIds, [activeTask.id]: true },
      taskIndexByActivity: {
        ...current.taskIndexByActivity,
        [activeActivity.id]: isLastTaskInActivity ? 0 : activeTaskIndex + 1,
        [nextActivity.id]: nextIndex
      }
    }));

    window.setTimeout(() => {
      if (dailyPlanComplete) {
        speak("เยี่ยมมาก แผนวันนี้ครบแล้ว พักสายตาได้เลย");
        return;
      }
      if (autoSpeak) return;
      if (isLastTaskInActivity) {
        speak(`จบฐาน ${activeActivity.title} แล้ว ต่อไปฐาน ${nextActivity.title} ${nextTask.prompt}`);
        return;
      }
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
        activeProfile={activeProfile}
        profiles={learnerProfiles}
        onSelectProfile={handleSelectProfile}
        onResetProfile={handleResetProfile}
        onSpeakIntro={() => speak("วันนี้เราจะฝึกแบบสบาย ๆ ฟังโจทย์ให้จบ แล้วค่อยแตะคำตอบนะกาเนส")}
      />

      <main className="main-grid">
        <section className="mission-column" aria-label="กิจกรรมวันนี้">
          <div className="today-banner">
            <span>⭐</span>
            <div>
              <h2>วันนี้ฝึกอะไรดี</h2>
              <p>{progress.practiceMode === "daily" ? "กำลังฝึกตามแผนวันนี้แบบสั้น ไม่หนักเกินไป" : activeActivity.goal}</p>
            </div>
          </div>

          <div className="daily-plan-card">
            <div className="daily-plan-head">
              <div>
                <span>แผนวันนี้</span>
                <strong>{dailyPlanStatus.completed}/{dailyPlanStatus.total} ข้อ</strong>
              </div>
              <button type="button" onClick={handleStartDailyPlan} disabled={!dailyPlanStatus.nextActivityId}>
                {dailyPlanStatus.nextActivityId ? (progress.practiceMode === "daily" ? "ต่อแผน" : "เริ่มแผน") : "ครบแล้ว"}
              </button>
            </div>
            <div className="daily-plan-steps">
              {dailyPlanStatus.rows.map((row) => (
                <div key={row.activityId} className={row.done >= row.target ? "is-done" : ""}>
                  <span style={{ background: row.activity.color }}>{row.activity.order}</span>
                  <strong>{row.activity.shortTitle}</strong>
                  <small>{row.done}/{row.target}</small>
                </div>
              ))}
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
          autoSpeak={autoSpeak}
          onSpeak={speak}
          onToggleAutoSpeak={handleToggleAutoSpeak}
          onMistake={handleMistake}
          onComplete={handleCompleteTask}
        />

        <ParentPanel
          checklist={checklist}
          checked={checked}
          routine={routine}
          activities={activities}
          activeProfile={activeProfileInfo}
          progressByActivity={progressByActivity}
          totalByActivity={totalByActivity}
          completedToday={completedToday}
          mistakeCount={mistakeCount}
          dailyPlanCompleted={dailyPlanStatus.completed}
          dailyPlanTotal={dailyPlanStatus.total}
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
