import MotionButton from "./ui/MotionButton";
import AnimatedDialog from "./ui/AnimatedDialog";
import { MotionSwap } from "./ui/MotionContent";
import { useCallback, useEffect, useMemo, useState } from "react";
import { pick } from "../i18n";
import { generateStory } from "../lib/storyteller";

const MODES = {
  vi: [
    ["quick", "⚡", "Kể nhanh 1 phút", "Một lát cắt ngắn gọn"],
    ["history", "◷", "Dòng chảy lịch sử", "Những dấu mốc quan trọng"],
    ["culture", "♬", "Hồn văn hóa", "Đời sống, nghệ thuật, ẩm thực"],
    ["local", "◈", "Chuyện người bản địa", "Giai thoại và góc nhìn gần gũi"],
  ],
  en: [
    ["quick", "⚡", "One-minute story", "A quick introduction"],
    ["history", "◷", "Through history", "The moments that shaped this place"],
    ["culture", "♬", "Cultural soul", "Life, arts and cuisine"],
    ["local", "◈", "Local stories", "Tales and a closer perspective"],
  ],
};

export default function AIStoryteller({ dest, lang, onClose }) {
  const modes = MODES[lang] || MODES.en;
  const [mode, setMode] = useState("quick");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [source, setSource] = useState("");
  const active = useMemo(() => modes.find((m) => m[0] === mode), [modes, mode]);

  const create = useCallback(
    async (nextMode) => {
      setLoading(true);
      setStory("");
      setSource("");
      try {
        const result = await generateStory({ dest, lang, mode: nextMode });
        setStory(result.text);
        setSource(result.source);
      } catch {
        setStory(
          lang === "vi"
            ? "Không thể tạo câu chuyện lúc này. Hãy thử lại sau."
            : "The story could not be generated right now.",
        );
      } finally {
        setLoading(false);
      }
    },
    [dest, lang],
  );

  useEffect(() => {
    setMode("quick");
    setSpeaking(false);
    create("quick");
    return () => window.speechSynthesis?.cancel();
  }, [create]);

  const choose = (id) => {
    setMode(id);
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    create(id);
  };
  const speak = () => {
    if (!story || !window.speechSynthesis) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(story);
    utter.lang =
      lang === "vi"
        ? "vi-VN"
        : lang === "zh"
          ? "zh-CN"
          : lang === "ko"
            ? "ko-KR"
            : "en-US";
    utter.rate = 0.95;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  return (
    <AnimatedDialog
      title={pick(dest.name, lang)}
      onClose={onClose}
      onClosing={() => window.speechSynthesis?.cancel()}
      variant="storyteller"
      className="story-modal"
    >
      {({ close }) => (
        <>
          <header className="story-head">
            <div>
              <span className="story-ai-badge">✦ STORYTELLER</span>
              <h2>{pick(dest.name, lang)}</h2>
              <p>
                {lang === "vi"
                  ? `Câu chuyện đang gắn với ${pick(dest.name, lang)} — chọn cách bạn muốn nghe.`
                  : `This story is tied to ${pick(dest.name, lang)} — choose how you want to hear it.`}
              </p>
            </div>
            <MotionButton
              className="story-close"
              onClick={close}
              aria-label="Đóng kể chuyện theo chủ đề"
            >
              ×
            </MotionButton>
          </header>

          <div className="story-modes">
            {modes.map(([id, icon, title, sub]) => (
              <MotionButton
                key={id}
                className={mode === id ? "on" : ""}
                onClick={() => choose(id)}
              >
                <i>{icon}</i>
                <span>
                  <strong>{title}</strong>
                  <small>{sub}</small>
                </span>
              </MotionButton>
            ))}
          </div>

          <MotionSwap
            as="article"
            key={`${mode}-${loading}`}
            className="story-paper"
          >
            <div className="story-paper__top">
              <span>
                {active?.[1]} {active?.[2]}
              </span>
              {source && (
                <small>
                  {source === "ai"
                    ? "AI generated · grounded in project data"
                    : lang === "vi"
                      ? "Bản demo · tổng hợp từ dữ liệu dự án"
                      : "Demo · composed from project data"}
                </small>
              )}
            </div>
            {loading ? (
              <div className="story-loading">
                <i />
                <i />
                <i />
                <span>
                  {lang === "vi"
                    ? "Đang dệt nên câu chuyện..."
                    : "Crafting your story..."}
                </span>
              </div>
            ) : (
              <p>{story}</p>
            )}
          </MotionSwap>

          <footer className="story-actions">
            <MotionButton
              className="story-listen"
              onClick={speak}
              disabled={loading || !story}
            >
              {speaking ? "■" : "▶"}{" "}
              {speaking
                ? lang === "vi"
                  ? "Dừng kể"
                  : "Stop"
                : lang === "vi"
                  ? "Nghe thuyết minh"
                  : "Listen"}
            </MotionButton>
            <MotionButton
              className="story-again"
              onClick={() => create(mode)}
              disabled={loading}
            >
              ↻ {lang === "vi" ? "Tạo lại cùng chủ đề" : "Rebuild same theme"}
            </MotionButton>
          </footer>
        </>
      )}
    </AnimatedDialog>
  );
}
