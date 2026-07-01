import { ArrowRight, Check, Mic, Play, Volume2, X } from "lucide-react";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Activity, ChoiceOption, LearningTask } from "../types";
import { TracePad } from "./TracePad";

type LearningStageProps = {
  activity: Activity;
  task: LearningTask;
  taskNumber: number;
  totalTasks: number;
  speaking: boolean;
  autoSpeak: boolean;
  onSpeak: (text: string) => void;
  onToggleAutoSpeak: () => void;
  onMistake: (taskId: string) => void;
  onComplete: () => void;
};

type AnswerState = "idle" | "try" | "success";
const defaultHint = "ลองฟังโจทย์อีกครั้ง แล้วค่อยแตะคำตอบนะ";

export function LearningStage({
  activity,
  task,
  taskNumber,
  totalTasks,
  speaking,
  autoSpeak,
  onSpeak,
  onToggleAutoSpeak,
  onMistake,
  onComplete
}: LearningStageProps) {
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [hintMessage, setHintMessage] = useState(defaultHint);
  const [sequence, setSequence] = useState<string[]>([]);

  useEffect(() => {
    setAnswerState("idle");
    setHintMessage(defaultHint);
    setSequence([]);
  }, [task.id]);

  const progressLabel = `${taskNumber}/${totalTasks}`;

  const selectedMap = useMemo(() => new Set(sequence), [sequence]);
  const choiceVisual = task.kind === "choice" ? task.visual : undefined;
  const promptSpeechText = useMemo(
    () => `${activity.title} ${task.prompt}${choiceVisual ? ` ${choiceVisual.title}` : ""}`,
    [activity.title, choiceVisual, task.prompt]
  );

  const speakPrompt = useCallback(() => onSpeak(promptSpeechText), [onSpeak, promptSpeechText]);

  useEffect(() => {
    if (!autoSpeak) return;
    const timer = window.setTimeout(speakPrompt, 350);
    return () => window.clearTimeout(timer);
  }, [autoSpeak, speakPrompt]);

  const markSuccess = (message: string) => {
    setAnswerState("success");
    onSpeak(message);
  };

  const markTryAgain = () => {
    const nextHint = task.hint ?? defaultHint;
    setAnswerState("try");
    setHintMessage(nextHint);
    onMistake(task.id);
    onSpeak(nextHint);
  };

  const handleChoice = (option: ChoiceOption) => {
    if (task.kind !== "choice") return;
    if (option.id === task.answerId) {
      markSuccess(task.success);
      return;
    }
    markTryAgain();
  };

  const handleSequence = (option: ChoiceOption) => {
    if (task.kind !== "sequence" || answerState === "success") return;
    const expected = task.answerIds[sequence.length];
    if (option.id !== expected) {
      markTryAgain();
      setSequence([]);
      return;
    }

    const nextSequence = [...sequence, option.id];
    setSequence(nextSequence);
    setAnswerState("idle");

    if (nextSequence.length === task.answerIds.length) {
      markSuccess(task.success);
    }
  };

  return (
    <section
      className="learning-stage"
      data-state={answerState}
      style={{ "--activity-color": activity.color } as CSSProperties}
    >
      <div className="stage-title-row">
        <div className="lesson-badge">
          <Volume2 size={22} />
          <span>{activity.order}. {activity.title}</span>
        </div>
        <div className="task-counter" aria-label={`โจทย์ที่ ${progressLabel}`}>
          {progressLabel}
        </div>
      </div>

      <div className="prompt-band">
        <button className="speaker-orb" type="button" onClick={speakPrompt} aria-label="ฟังโจทย์">
          {speaking ? <X size={46} /> : <Volume2 size={54} />}
        </button>
        <div className="prompt-copy">
          <span>ครูพูดว่า</span>
          <h2>{task.prompt}</h2>
          <p>{task.parentCue}</p>
        </div>
      </div>

      {choiceVisual ? (
        <div className="question-visual" aria-label={choiceVisual.title}>
          <strong>{choiceVisual.title}</strong>
          <div className="question-visual-items">
            {choiceVisual.items.map((item) => (
              <div key={item.id} className="question-visual-card">
                <span className="question-visual-emoji" aria-hidden="true">{item.emoji}</span>
                <span className="question-visual-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {task.kind === "choice" ? (
        <div className="choice-grid">
          {task.options.map((option) => (
            <button key={option.id} type="button" className="choice-card" onClick={() => handleChoice(option)}>
              <span className="choice-emoji" aria-hidden="true">{option.emoji}</span>
              <strong>{option.label}</strong>
              {option.helper ? <small>{option.helper}</small> : null}
            </button>
          ))}
        </div>
      ) : null}

      {task.kind === "sequence" ? (
        <>
          <div className="sequence-path" aria-label="ลำดับที่แตะแล้ว">
            {task.answerIds.map((answerId, index) => {
              const done = sequence[index] === answerId;
              return (
                <span key={answerId} className={done ? "is-done" : ""}>
                  {done ? <Check size={20} /> : index + 1}
                </span>
              );
            })}
          </div>
          <div className="choice-grid">
            {task.options.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`choice-card ${selectedMap.has(option.id) ? "is-selected" : ""}`}
                onClick={() => handleSequence(option)}
              >
                <span className="choice-emoji" aria-hidden="true">{option.emoji}</span>
                <strong>{option.label}</strong>
              </button>
            ))}
          </div>
        </>
      ) : null}

      {task.kind === "trace" ? (
        <TracePad task={task} onDone={() => markSuccess(task.success)} />
      ) : null}

      {task.kind === "interview" ? (
        <div className="interview-zone">
          <div className="mic-bubble" aria-hidden="true">
            <Mic size={54} />
          </div>
          <div>
            <span>ตัวอย่างคำตอบ</span>
            <p>{task.sampleAnswer}</p>
          </div>
          <button type="button" className="complete-button" onClick={() => markSuccess(task.success)}>
            พูดแล้ว
          </button>
        </div>
      ) : null}

      <div className={`feedback ${answerState}`}>
        {answerState === "success" ? (
          <>
            <Check size={24} />
            <span>{task.success}</span>
          </>
        ) : answerState === "try" ? (
          <>
            <Play size={24} />
            <span>{hintMessage}</span>
          </>
        ) : (
          <>
            <Play size={24} />
            <span>{autoSpeak ? "ฟังโจทย์ให้จบ แล้วค่อยแตะคำตอบ" : "กดปุ่มลำโพง แล้วค่อยแตะคำตอบ"}</span>
          </>
        )}
      </div>

      <div className="stage-actions">
        <button type="button" className="secondary-action" onClick={speakPrompt}>
          <Volume2 size={22} />
          <span>ฟังอีกครั้ง</span>
        </button>
        <button
          type="button"
          className={`secondary-action auto-speak-toggle ${autoSpeak ? "is-on" : ""}`}
          onClick={onToggleAutoSpeak}
        >
          <Volume2 size={22} />
          <span>{autoSpeak ? "อ่านอัตโนมัติ" : "แตะอ่านเอง"}</span>
        </button>
        <button type="button" className="next-action" onClick={onComplete} disabled={answerState !== "success"}>
          <span>ทำต่อ</span>
          <ArrowRight size={30} />
        </button>
      </div>
    </section>
  );
}
