"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const SPEED_MS = 35;
const STEP = 1 / 5;

type HoverScrambleHeadingProps = {
  text: string;
  highlight?: string;
  as?: "h2" | "h3" | "h4";
  className?: string;
  highlightClassName?: string;
};

/** Wraps a heading and on hover scrambles its characters
 *  (same effect as `TextScramble` for tags, but built for longer
 *  multi-word headings, with an optional `highlight` slice that gets
 *  rendered in a styled span. Static text - no scroll animation. */
export default function HoverScrambleHeading({
  text,
  highlight,
  as: Tag = "h2",
  className,
  highlightClassName,
}: HoverScrambleHeadingProps) {
  const baseMain = text.trim();
  const baseHighlight = highlight?.trim() ?? "";
  const [scrambledMain, setScrambledMain] = useState<string | null>(null);
  const [scrambledHighlight, setScrambledHighlight] = useState<string | null>(
    null
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const scramble = useCallback(
    (full: string, setter: (v: string | null) => void) => {
      let progress = 0;
      const len = full.length;
      intervalRef.current = setInterval(() => {
        progress += STEP;
        const revealed = Math.floor(progress * len);
        let out = "";
        for (let i = 0; i < len; i++) {
          const ch = full[i];
          if (i < revealed || ch === " ") {
            out += ch;
          } else if (/[a-zA-Z0-9]/.test(ch)) {
            out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
          } else {
            out += ch;
          }
        }
        setter(out);
        if (progress >= 1) {
          clear();
          setter(null);
        }
      }, SPEED_MS);
    },
    [clear]
  );

  const onEnter = useCallback(() => {
    clear();
    setScrambledMain(baseMain);
    if (baseHighlight) setScrambledHighlight(baseHighlight);
    scramble(baseMain, setScrambledMain);
    if (baseHighlight) {
      // Second interval for highlight portion.
      setTimeout(() => scramble(baseHighlight, setScrambledHighlight), 60);
    }
  }, [baseHighlight, baseMain, clear, scramble]);

  const onLeave = useCallback(() => {
    clear();
    setScrambledMain(null);
    setScrambledHighlight(null);
  }, [clear]);

  useEffect(() => clear, [clear]);

  return (
    <Tag
      className={className}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      {scrambledMain ?? baseMain}
      {baseHighlight ? (
        <>
          {" "}
          <span className={highlightClassName}>
            {scrambledHighlight ?? baseHighlight}
          </span>
        </>
      ) : null}
    </Tag>
  );
}
