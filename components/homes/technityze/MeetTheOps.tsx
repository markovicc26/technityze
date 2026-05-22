"use client";

import { useEffect, useRef, useState } from "react";
import HoverScrambleHeading from "@/components/animations/HoverScrambleHeading";
import TextScramble from "@/components/animations/TextScramble";

const OCTOPUS_MAP = [
  "000000000000000000000000",
  "000000000111111000000000",
  "000000011111111100000000",
  "000000111111111111000000",
  "000001111111111111100000",
  "000001111111111111100000",
  "000011111111111111110000",
  "000011111111111111110000",
  "000011111111111111110000",
  "000011111111111111110000",
  "000011111111111111110000",
  "000011111111111111110000",
  "000001111111111111100000",
  "000001111111111111100000",
  "011100110000000011001100",
  "110101100000000011101010",
  "110111000000000000111010",
  "111001110100011111000010",
  "011111110100011011111100",
  "001111110100011011111100",
  "000001101110011101100000",
  "000001011110011110100000",
  "000001110011110011100000",
  "000000000000000000000000",
];

const PIXEL_SIZE = 8;
const VIEW = 24 * PIXEL_SIZE; // 192px

type TerminalLine = {
  text: string;
  color?: string;
  delay?: number;
};

type Tab = {
  label: string;
  command: string;
  lines: TerminalLine[];
};

const TABS: Tab[] = [
  {
    label: "install",
    command: "npm install technityze",
    lines: [
      { text: "", delay: 80 },
      { text: "  added technityze in 12s", color: "#6FF7CC", delay: 400 },
      { text: "", delay: 80 },
      { text: "  +---------------------------+", color: "#ED42B5", delay: 120 },
      { text: "  |       TECHNITYZE          |", color: "#ED42B5", delay: 120 },
      { text: "  |   Built. Shipped.         |", color: "#ED42B5", delay: 120 },
      { text: "  |   Still running.          |", color: "#ED42B5", delay: 120 },
      { text: "  +---------------------------+", color: "#ED42B5", delay: 160 },
      { text: "", delay: 80 },
      { text: "  found 0 vulnerabilities", color: "#ADFA1F", delay: 200 },
      { text: "  found 0 hidden costs", color: "#ADFA1F", delay: 250 },
    ],
  },
  {
    label: "build",
    command: "npm run build",
    lines: [
      { text: "", delay: 80 },
      { text: "  > technityze@1.0.0 build", color: "#cbd5e1", delay: 200 },
      { text: "  > next build", color: "#cbd5e1", delay: 200 },
      { text: "", delay: 80 },
      { text: "  ▲ Next.js 16.1.6", color: "#cbd5e1", delay: 200 },
      { text: "", delay: 80 },
      {
        text: "  Creating an optimized production build...",
        color: "#94a3b8",
        delay: 220,
      },
      { text: "  ✓ Compiled successfully", color: "#6FF7CC", delay: 200 },
      {
        text: "  ✓ Linting and checking validity of types",
        color: "#6FF7CC",
        delay: 150,
      },
      {
        text: "  ✓ Generating static pages (12/12)",
        color: "#6FF7CC",
        delay: 150,
      },
      { text: "  ✓ Optimizing images", color: "#6FF7CC", delay: 150 },
      { text: "", delay: 80 },
      {
        text: "  Route (app)            Size      First Load JS",
        color: "#64748b",
        delay: 150,
      },
      {
        text: "  ┌ ○ /                 142 kB           198 kB",
        color: "#64748b",
        delay: 100,
      },
      {
        text: "  ├ ○ /work              61 kB            57 kB",
        color: "#64748b",
        delay: 100,
      },
      {
        text: "  └ ○ /contact           75 kB            92 kB",
        color: "#64748b",
        delay: 100,
      },
      { text: "", delay: 80 },
      { text: "  ✓ Build completed in 4.2s", color: "#6FF7CC", delay: 300 },
      { text: "", delay: 80 },
      {
        text: "  // no framework migration calls in 6 months",
        color: "#64748b",
        delay: 220,
      },
    ],
  },
  {
    label: "deploy",
    command: "vercel deploy --prod",
    lines: [
      { text: "", delay: 80 },
      { text: "  Vercel CLI 39.2.0", color: "#94a3b8", delay: 200 },
      { text: "", delay: 80 },
      {
        text: "  > Deploying to production...",
        color: "#ED42B5",
        delay: 300,
      },
      { text: "", delay: 80 },
      { text: "  ✓ Building (4.1s)", color: "#6FF7CC", delay: 220 },
      { text: "  ✓ Uploading (12 files)", color: "#6FF7CC", delay: 200 },
      { text: "  ✓ Running migrations", color: "#6FF7CC", delay: 200 },
      { text: "  ✓ Sending invoice (jk)", color: "#6FF7CC", delay: 200 },
      { text: "  ✓ Finalizing", color: "#6FF7CC", delay: 200 },
      { text: "", delay: 80 },
      {
        text: "  Production: https://yourdomain.com",
        color: "#ED42B5",
        delay: 350,
      },
      { text: "", delay: 80 },
      { text: "  ✓ Deployment complete", color: "#6FF7CC", delay: 200 },
      { text: "", delay: 80 },
      {
        text: "  // pager goes to us now, sleep well",
        color: "#64748b",
        delay: 250,
      },
    ],
  },
  {
    label: "test",
    command: "npm test",
    lines: [
      { text: "", delay: 80 },
      {
        text: "  PASS  src/components/Pricing.test.tsx",
        color: "#94a3b8",
        delay: 200,
      },
      {
        text: "    ✓ shows real prices (not 'contact us')",
        color: "#ADFA1F",
        delay: 120,
      },
      { text: "    ✓ no hidden fees", color: "#ADFA1F", delay: 120 },
      {
        text: "  PASS  src/utils/scope.test.ts",
        color: "#94a3b8",
        delay: 150,
      },
      {
        text: "    ✓ matches what was promised in the call",
        color: "#ADFA1F",
        delay: 120,
      },
      { text: "    ✓ respects the deadline", color: "#ADFA1F", delay: 120 },
      {
        text: "  PASS  src/utils/handoff.test.ts",
        color: "#94a3b8",
        delay: 150,
      },
      {
        text: "    ✓ no rotating dev shop",
        color: "#ADFA1F",
        delay: 120,
      },
      {
        text: "    ✓ pager answers in under 30 min",
        color: "#ADFA1F",
        delay: 120,
      },
      { text: "", delay: 80 },
      {
        text: "  Test Suites: 3 passed, 3 total",
        color: "#ADFA1F",
        delay: 200,
      },
      {
        text: "  Tests:       6 passed, 6 total",
        color: "#ADFA1F",
        delay: 150,
      },
      { text: "  Time:        1.234 s", color: "#64748b", delay: 100 },
    ],
  },
];

function PixelOctopus() {
  const bodyRef = useRef<SVGGElement>(null);
  const leftEyeRef = useRef<SVGRectElement>(null);
  const rightEyeRef = useRef<SVGRectElement>(null);
  const stateRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const blinkRef = useRef({ scaleY: 1, next: performance.now() + 4000 });
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const updateTarget = (e: PointerEvent) => {
      // Use viewport center as the neutral origin so the octopus's gaze
      // sweeps the full screen rather than being capped near its own
      // position.
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      stateRef.current.tx = Math.max(
        -1,
        Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)),
      );
      stateRef.current.ty = Math.max(
        -1,
        Math.min(1, (e.clientY - cy) / (window.innerHeight / 2)),
      );
    };

    window.addEventListener("pointermove", updateTarget);

    let raf = 0;
    const animate = () => {
      const s = stateRef.current;
      // moderately slow follow - feels deliberate, not jittery
      s.x += (s.tx - s.x) * 0.07;
      s.y += (s.ty - s.y) * 0.07;

      const eyeX = Math.max(-20, Math.min(20, s.x * 30));
      const eyeY = Math.max(-16, Math.min(16, s.y * 24));
      const tilt = Math.max(-18, Math.min(18, s.x * 22));
      const bob = Math.sin(Date.now() / 700) * 1.2;

      const now = performance.now();
      const blink = blinkRef.current;
      const since = now - blink.next;
      if (since > 0 && since < 80) {
        blink.scaleY = 0.08;
      } else if (since >= 80 && since < 170) {
        blink.scaleY = 1;
        blink.next = now + 3500 + Math.random() * 4000;
      } else if (since < 0) {
        blink.scaleY = 1;
      }

      if (bodyRef.current) {
        bodyRef.current.style.transformOrigin = "96px 120px";
        bodyRef.current.style.transform = `translate(${s.x * 14}px, ${s.y * 9 + bob}px) rotate(${tilt}deg)`;
      }

      [leftEyeRef.current, rightEyeRef.current].forEach((eye) => {
        if (!eye) return;
        eye.style.transformOrigin = "center";
        eye.style.transform = `translate(${eyeX}px, ${eyeY}px) scaleY(${blink.scaleY})`;
      });

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", updateTarget);
    };
  }, []);

  const bodyPixels: React.ReactNode[] = [];
  OCTOPUS_MAP.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      if (cell !== "1") return;
      bodyPixels.push(
        <rect
          key={`${x}-${y}`}
          x={x * PIXEL_SIZE}
          y={y * PIXEL_SIZE}
          width={PIXEL_SIZE + 0.3}
          height={PIXEL_SIZE + 0.3}
        />,
      );
    });
  });

  return (
    <div ref={wrapRef} className="technityze-mto__octopus">
      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        role="img"
        aria-label="Technityze octopus mascot"
      >
        <g
          ref={bodyRef}
          className="technityze-mto__octopus-body"
          fill="currentColor"
        >
          {bodyPixels}
        </g>
        <rect
          ref={leftEyeRef}
          x={80}
          y={68}
          width={12}
          height={16}
          fill="#000000"
        />
        <rect
          ref={rightEyeRef}
          x={104}
          y={68}
          width={12}
          height={16}
          fill="#000000"
        />
      </svg>
    </div>
  );
}

function Terminal() {
  const [activeIdx, setActiveIdx] = useState(0); // start on "install"
  const [typedCommand, setTypedCommand] = useState("");
  const [visibleLines, setVisibleLines] = useState(0);
  // Bumps on every viewport re-entry so the typing animation restarts.
  const [playKey, setPlayKey] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  const activeTab = TABS[activeIdx];

  // Re-trigger the typing animation every time the terminal enters the
  // viewport. We bump playKey on each entry; the typing effect depends
  // on it and resets from the start.
  useEffect(() => {
    const el = terminalRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setPlayKey((k) => k + 1);
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Type out the command, then progressively reveal lines.
  useEffect(() => {
    if (playKey === 0) return;
    setTypedCommand("");
    setVisibleLines(0);
    let cancelled = false;

    const cmd = activeTab.command;
    let i = 0;
    const typeNext = () => {
      if (cancelled) return;
      if (i <= cmd.length) {
        setTypedCommand(cmd.slice(0, i));
        i += 1;
        setTimeout(typeNext, 55 + Math.random() * 40);
      } else {
        // Reveal lines one by one
        let lineIdx = 0;
        const revealNext = () => {
          if (cancelled) return;
          if (lineIdx >= activeTab.lines.length) return;
          setVisibleLines(lineIdx + 1);
          const delay = activeTab.lines[lineIdx].delay ?? 150;
          lineIdx += 1;
          setTimeout(revealNext, delay);
        };
        setTimeout(revealNext, 350);
      }
    };
    typeNext();

    return () => {
      cancelled = true;
    };
  }, [activeIdx, activeTab, playKey]);

  return (
    <div ref={terminalRef} className="technityze-mto__terminal">
      <div className="technityze-mto__terminal-chrome">
        <span className="technityze-mto__dot technityze-mto__dot--red" />
        <span className="technityze-mto__dot technityze-mto__dot--yellow" />
        <span className="technityze-mto__dot technityze-mto__dot--green" />
        <span className="technityze-mto__chrome-title">
          ~/technityze/{activeTab.label}
        </span>
        <PixelOctopus />
      </div>

      <div className="technityze-mto__terminal-body">
        <div className="technityze-mto__prompt-line">
          <span className="technityze-mto__prompt">$</span>
          <span className="technityze-mto__cmd">{typedCommand}</span>
          <span className="technityze-mto__caret" />
        </div>

        {activeTab.lines.slice(0, visibleLines).map((line, i) => (
          <div
            key={`${activeIdx}-${i}`}
            className="technityze-mto__line"
            style={{ color: line.color ?? "#94a3b8" }}
          >
            {line.text || " "}
          </div>
        ))}
      </div>

      <div className="technityze-mto__tabs">
        {TABS.map((tab, i) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActiveIdx(i)}
            className={
              "technityze-mto__tab" +
              (i === activeIdx ? " technityze-mto__tab--active" : "")
            }
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function MeetTheOps() {
  return (
    <section className="technityze-mto" aria-label="Meet the ops">
      <div className="technityze-mto__inner">
        <div className="technityze-mto__copy">
          <TextScramble className="technityze-mto__eyebrow mxd-scramble">
            How we operate
          </TextScramble>
          <HoverScrambleHeading
            as="h2"
            className="technityze-mto__title"
            text="Hand-built, hand-operated."
          />
          <p className="technityze-mto__body">
            Boutique by design. We keep the team small because every
            project we take, we take responsibility for - from
            architecture to the 3am alerts.
          </p>
          <ul className="technityze-mto__meta">
            <li>
              <span className="technityze-mto__meta-num">01</span>
              <span className="technityze-mto__meta-label">
                Two senior operators
              </span>
            </li>
            <li>
              <span className="technityze-mto__meta-num">02</span>
              <span className="technityze-mto__meta-label">
                Build + run, same team
              </span>
            </li>
            <li>
              <span className="technityze-mto__meta-num">03</span>
              <span className="technityze-mto__meta-label">
                Selective intake
              </span>
            </li>
          </ul>
        </div>

        <Terminal />
      </div>
    </section>
  );
}
