import { useCallback, useEffect, useMemo, useState } from "react";

export function useSpeech() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  const thaiVoice = useMemo(
    () => voices.find((voice) => voice.lang.toLowerCase().startsWith("th")) ?? voices[0],
    [voices]
  );

  const stop = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!("speechSynthesis" in window)) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = thaiVoice?.lang ?? "th-TH";
      utterance.voice = thaiVoice ?? null;
      utterance.rate = 0.82;
      utterance.pitch = 1.06;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    },
    [thaiVoice]
  );

  return { speak, stop, speaking, hasSpeech: "speechSynthesis" in window };
}
