export type ActivityId = "listen" | "thai" | "math" | "trace" | "interview";

export type LearnerId = "ganesh" | "papa";

export type LearnerProfile = {
  id: LearnerId;
  label: string;
  emoji: string;
};

export type ChoiceOption = {
  id: string;
  label: string;
  emoji: string;
  helper?: string;
};

export type PromptVisual = {
  title: string;
  items: ChoiceOption[];
};

export type ChoiceTask = {
  kind: "choice";
  id: string;
  title: string;
  prompt: string;
  parentCue: string;
  hint?: string;
  visual?: PromptVisual;
  options: ChoiceOption[];
  answerId: string;
  success: string;
};

export type SequenceTask = {
  kind: "sequence";
  id: string;
  title: string;
  prompt: string;
  parentCue: string;
  hint?: string;
  options: ChoiceOption[];
  answerIds: string[];
  success: string;
};

export type TraceTask = {
  kind: "trace";
  id: string;
  title: string;
  prompt: string;
  parentCue: string;
  hint?: string;
  guide: "wave" | "circle" | "zigzag";
  startEmoji?: string;
  endEmoji?: string;
  success: string;
};

export type InterviewTask = {
  kind: "interview";
  id: string;
  title: string;
  prompt: string;
  parentCue: string;
  hint?: string;
  sampleAnswer: string;
  success: string;
};

export type LearningTask = ChoiceTask | SequenceTask | TraceTask | InterviewTask;

export type Activity = {
  id: ActivityId;
  order: number;
  title: string;
  shortTitle: string;
  color: string;
  accent: string;
  emoji: string;
  goal: string;
  tasks: LearningTask[];
};

export type PracticeMode = "free" | "daily";

export type ProgressState = {
  dateKey: string;
  activeActivity: ActivityId;
  practiceMode: PracticeMode;
  stars: number;
  doneTaskIds: Record<string, boolean>;
  mistakesByTaskId: Record<string, number>;
  taskIndexByActivity: Record<ActivityId, number>;
};

export type DailyPlanItem = {
  activityId: ActivityId;
  target: number;
  minutes: number;
};

export type RoutineStep = {
  minutes: number;
  title: string;
  detail: string;
};

export type ChecklistItem = {
  id: string;
  icon: string;
  label: string;
};
