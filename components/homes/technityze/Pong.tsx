"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LETTER_SPACING = 1;
const WORD_SPACING = 3;

// Pixel color codes used inside PIXEL_MAP arrays.
//   0 = empty
//   1 = letter pixel (theme-aware: white on dark, black on light)
//   2 = fire yellow
//   3 = fire orange
//   4 = fire red
const FIRE_COLOR: Record<number, string> = {
  2: "#FFE45C",
  3: "#FF8A1A",
  4: "#E83A00",
};
const FIRE_HIT_COLOR: Record<number, string> = {
  2: "#5A4810",
  3: "#5A2E0A",
  4: "#5A1A05",
};
type Palette = {
  bg: string;
  fg: string;
  hit: string;
};
const PALETTE_DARK: Palette = {
  bg: "#000000",
  fg: "#FFFFFF",
  hit: "#333333",
};
const PALETTE_LIGHT: Palette = {
  bg: "#FFFFFF",
  fg: "#000000",
  hit: "#CCCCCC",
};

const PIXEL_MAP: Record<string, number[][]> = {
  J: [
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  C: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  B: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  H: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  P: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  R: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  O: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  M: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  T: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  G: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  S: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  A: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  L: [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  Y: [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  U: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  D: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  E: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  // Pixel flame: 10 rows tall, 7 cols wide. Classic "multi-tongue" shape
  // with a tall central tip and two shorter side tongues. Layered
  // colors: 4=red outer, 3=orange mid, 2=yellow core.
  "*": [
    [0, 0, 0, 4, 0, 0, 0],
    [0, 4, 0, 4, 0, 0, 0],
    [0, 4, 0, 4, 0, 4, 0],
    [0, 4, 4, 3, 4, 4, 0],
    [0, 4, 3, 2, 3, 3, 4],
    [4, 3, 2, 2, 2, 3, 4],
    [4, 3, 2, 2, 2, 3, 4],
    [4, 3, 2, 3, 2, 3, 4],
    [0, 4, 3, 3, 3, 4, 0],
    [0, 0, 4, 4, 4, 0, 0],
  ],
};

type Pixel = {
  x: number;
  y: number;
  size: number;
  hit: boolean;
  colorCode: number;
};

type Ball = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
};

type Paddle = {
  x: number;
  y: number;
  width: number;
  height: number;
  targetY: number;
  isVertical: boolean;
};

export default function Pong() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const ballRef = useRef<Ball>({ x: 0, y: 0, dx: 0, dy: 0, radius: 0 });
  const paddlesRef = useRef<Paddle[]>([]);
  const scaleRef = useRef(1);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = wrap.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      scaleRef.current = Math.min(canvas.width / 1000, canvas.height / 1000);
      initializeGame();
    };

    const initializeGame = () => {
      const scale = scaleRef.current;
      const LARGE_PIXEL_SIZE = 6.8 * scale;
      const SMALL_PIXEL_SIZE = 4 * scale;
      const BALL_SPEED = 5 * scale;

      pixelsRef.current = [];
      const words = ["JUST CODE", "NO BULLSHIT *"];

      const calculateWordWidth = (word: string, pixelSize: number) => {
        return (
          word.split("").reduce((width, letter) => {
            const letterWidth = PIXEL_MAP[letter]?.[0]?.length ?? 0;
            return (
              width + letterWidth * pixelSize + LETTER_SPACING * pixelSize
            );
          }, 0) -
          LETTER_SPACING * pixelSize
        );
      };

      const calculateLineWidth = (line: string, pixelSize: number) => {
        return line.split(" ").reduce((width, word, i) => {
          return (
            width +
            calculateWordWidth(word, pixelSize) +
            (i > 0 ? WORD_SPACING * pixelSize : 0)
          );
        }, 0);
      };

      const totalWidthLarge = calculateLineWidth(words[0], LARGE_PIXEL_SIZE);
      const totalWidthSmall = calculateLineWidth(words[1], SMALL_PIXEL_SIZE);
      const totalWidth = Math.max(totalWidthLarge, totalWidthSmall);
      const scaleFactor = (canvas.width * 0.8) / totalWidth;

      const adjustedLargePixelSize = LARGE_PIXEL_SIZE * scaleFactor;
      const adjustedSmallPixelSize = SMALL_PIXEL_SIZE * scaleFactor;

      const largeTextHeight = 5 * adjustedLargePixelSize;
      const smallTextHeight = 5 * adjustedSmallPixelSize;
      const spaceBetweenLines = 3.61 * adjustedLargePixelSize;
      const totalTextHeight =
        largeTextHeight + spaceBetweenLines + smallTextHeight;

      let startY = (canvas.height - totalTextHeight) / 2;

      words.forEach((line, lineIdx) => {
        const pixelSize =
          lineIdx === 0 ? adjustedLargePixelSize : adjustedSmallPixelSize;
        const lineW = calculateLineWidth(line, pixelSize);
        let startX = (canvas.width - lineW) / 2;

        line.split(" ").forEach((subWord) => {
          subWord.split("").forEach((letter) => {
            const pixelMap = PIXEL_MAP[letter];
            if (!pixelMap) return;
            // Glyphs taller than 5 rows (e.g. flame *) get vertically
            // offset so their bottom aligns with the letter baseline.
            const verticalOffset =
              (5 - pixelMap.length) * pixelSize;
            for (let i = 0; i < pixelMap.length; i++) {
              for (let j = 0; j < pixelMap[i].length; j++) {
                const code = pixelMap[i][j];
                if (code) {
                  pixelsRef.current.push({
                    x: startX + j * pixelSize,
                    y: startY + verticalOffset + i * pixelSize,
                    size: pixelSize,
                    hit: false,
                    colorCode: code,
                  });
                }
              }
            }
            startX += (pixelMap[0].length + LETTER_SPACING) * pixelSize;
          });
          startX += WORD_SPACING * pixelSize;
        });

        startY += lineIdx === 0 ? largeTextHeight + spaceBetweenLines : 0;
      });

      const ballStartX = canvas.width * 0.9;
      const ballStartY = canvas.height * 0.1;
      ballRef.current = {
        x: ballStartX,
        y: ballStartY,
        dx: -BALL_SPEED,
        dy: BALL_SPEED,
        radius: adjustedLargePixelSize / 2,
      };

      const paddleWidth = adjustedLargePixelSize / 2;
      const paddleLength = 7 * adjustedLargePixelSize;
      paddlesRef.current = [
        {
          x: 0,
          y: canvas.height / 2 - paddleLength / 2,
          width: paddleWidth,
          height: paddleLength,
          targetY: canvas.height / 2 - paddleLength / 2,
          isVertical: true,
        },
        {
          x: canvas.width - paddleWidth,
          y: canvas.height / 2 - paddleLength / 2,
          width: paddleWidth,
          height: paddleLength,
          targetY: canvas.height / 2 - paddleLength / 2,
          isVertical: true,
        },
        {
          x: canvas.width / 2 - paddleLength / 2,
          y: 0,
          width: paddleLength,
          height: paddleWidth,
          targetY: canvas.width / 2 - paddleLength / 2,
          isVertical: false,
        },
        {
          x: canvas.width / 2 - paddleLength / 2,
          y: canvas.height - paddleWidth,
          width: paddleLength,
          height: paddleWidth,
          targetY: canvas.width / 2 - paddleLength / 2,
          isVertical: false,
        },
      ];
    };

    const updateGame = () => {
      const ball = ballRef.current;
      const paddles = paddlesRef.current;

      ball.x += ball.dx;
      ball.y += ball.dy;

      if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
      }
      if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx = -ball.dx;
      }

      paddles.forEach((paddle) => {
        if (paddle.isVertical) {
          if (
            ball.x - ball.radius < paddle.x + paddle.width &&
            ball.x + ball.radius > paddle.x &&
            ball.y > paddle.y &&
            ball.y < paddle.y + paddle.height
          ) {
            ball.dx = -ball.dx;
          }
        } else {
          if (
            ball.y - ball.radius < paddle.y + paddle.height &&
            ball.y + ball.radius > paddle.y &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width
          ) {
            ball.dy = -ball.dy;
          }
        }
      });

      paddles.forEach((paddle) => {
        if (paddle.isVertical) {
          paddle.targetY = ball.y - paddle.height / 2;
          paddle.targetY = Math.max(
            0,
            Math.min(canvas.height - paddle.height, paddle.targetY),
          );
          paddle.y += (paddle.targetY - paddle.y) * 0.1;
        } else {
          paddle.targetY = ball.x - paddle.width / 2;
          paddle.targetY = Math.max(
            0,
            Math.min(canvas.width - paddle.width, paddle.targetY),
          );
          paddle.x += (paddle.targetY - paddle.x) * 0.1;
        }
      });

      pixelsRef.current.forEach((pixel) => {
        if (
          !pixel.hit &&
          ball.x + ball.radius > pixel.x &&
          ball.x - ball.radius < pixel.x + pixel.size &&
          ball.y + ball.radius > pixel.y &&
          ball.y - ball.radius < pixel.y + pixel.size
        ) {
          pixel.hit = true;
          const cx = pixel.x + pixel.size / 2;
          const cy = pixel.y + pixel.size / 2;
          if (Math.abs(ball.x - cx) > Math.abs(ball.y - cy)) {
            ball.dx = -ball.dx;
          } else {
            ball.dy = -ball.dy;
          }
        }
      });
    };

    const drawGame = () => {
      const scheme = document.documentElement.getAttribute("color-scheme");
      const palette = scheme === "light" ? PALETTE_LIGHT : PALETTE_DARK;

      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      pixelsRef.current.forEach((pixel) => {
        if (pixel.colorCode === 1) {
          ctx.fillStyle = pixel.hit ? palette.hit : palette.fg;
        } else {
          ctx.fillStyle = pixel.hit
            ? FIRE_HIT_COLOR[pixel.colorCode]
            : FIRE_COLOR[pixel.colorCode];
        }
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
      });

      ctx.fillStyle = palette.fg;
      ctx.beginPath();
      ctx.arc(
        ballRef.current.x,
        ballRef.current.y,
        ballRef.current.radius,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      ctx.fillStyle = palette.fg;
      paddlesRef.current.forEach((paddle) => {
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
      });
    };

    const gameLoop = () => {
      updateGame();
      drawGame();
      rafRef.current = requestAnimationFrame(gameLoop);
    };

    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(wrap);
    gameLoop();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  // Pong is pinned to the viewport while the next section (MeetTheOps)
  // slides up over it, like the Osmo parallax pattern. Two parallel
  // scrollTriggers:
  //   1. Pin the Pong section, with a scrub-driven zoom-out + fade so
  //      it visually recedes as the user scrolls (depth).
  //   2. Translate the next section's wrap from y:100vh up to y:0 over
  //      the same scroll range, so it climbs over the receding Pong.
  // pinSpacing: true keeps the next section from appearing too early
  // (it provides the scroll distance the slide animation needs).
  // useLayoutEffect so pin.kill() runs before React removes pinned DOM;
  // useEffect cleanup runs after commit and leaves pin wrappers → removeChild errors.
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1200) return;
    gsap.registerPlugin(ScrollTrigger);
    const section = document.querySelector<HTMLElement>("#pong");
    const wrap = wrapRef.current;
    const nextWrap = document.querySelector<HTMLElement>(".technityze-mto");
    if (!section || !wrap) return;

    const pin = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=100%",
      pin: true,
      pinSpacing: false,
      scrub: true,
      animation: gsap.to(wrap, {
        autoAlpha: 0.4,
        scale: 0.94,
        ease: "none",
      }),
    });

    let slide: ScrollTrigger | null = null;
    if (nextWrap) {
      gsap.set(nextWrap, { y: "100vh" });
      slide = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=100%",
        scrub: true,
        animation: gsap.to(nextWrap, {
          y: "0vh",
          ease: "none",
        }),
      });
    }

    return () => {
      pin.kill();
      slide?.kill();
    };
  }, []);

  return (
    <section id="pong" className="technityze-pong">
      <div ref={wrapRef} className="technityze-pong__wrap">
        <canvas
          ref={canvasRef}
          className="technityze-pong__canvas"
          aria-label="Pong game with pixel text"
        />
      </div>
    </section>
  );
}
