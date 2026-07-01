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
  guide: "wave" | "circle" | "zigzag";
  success: string;
};

export type InterviewTask = {
  kind: "interview";
  id: string;
  title: string;
  prompt: string;
  parentCue: string;
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
