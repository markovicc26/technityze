"use client";

import { useEffect, useRef } from "react";

type Pixel = {
  x: number;
  y: number;
  life: number;
  size: number;
};

type PixelTrailProps = {
  /** color of trail pixels (CSS color string) */
  color?: string;
  /** size in px of each pixel block */
  pixelSize?: number;
  /** how fast pixels fade out (0..1, higher = faster) */
  fadeSpeed?: number;
  /** how often a new pixel spawns while mouse moves (ms) */
  spawnRateMs?: number;
};

export function PixelTrail({
  color = "#6B1FD6",
  pixelSize = 8,
  fadeSpeed = 0.025,
  spawnRateMs = 16,
}: PixelTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const lastSpawnRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const onLeave = () => {
      mouseRef.current.active = false;
    };

    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);

    const tick = (now: number) => {
      const rect = parent.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // spawn new pixel(s) at mouse position if moving
      if (mouseRef.current.active && now - lastSpawnRef.current > spawnRateMs) {
        lastSpawnRef.current = now;
        // snap to pixel grid for crisp retro look
        const snappedX =
          Math.round(mouseRef.current.x / pixelSize) * pixelSize;
        const snappedY =
          Math.round(mouseRef.current.y / pixelSize) * pixelSize;
        // spawn a small cluster (3 pixels) with slight offsets for trail feel
        for (let i = 0; i < 3; i++) {
          const offX = (Math.floor(Math.random() * 3) - 1) * pixelSize;
          const offY = (Math.floor(Math.random() * 3) - 1) * pixelSize;
          pixelsRef.current.push({
            x: snappedX + offX,
            y: snappedY + offY,
            life: 1,
            size: pixelSize,
          });
        }
      }

      // clear and redraw
      ctx.clearRect(0, 0, w, h);
      const remaining: Pixel[] = [];
      for (const p of pixelsRef.current) {
        p.life -= fadeSpeed;
        if (p.life <= 0) continue;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        remaining.push(p);
      }
      ctx.globalAlpha = 1;
      pixelsRef.current = remaining;

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, [color, pixelSize, fadeSpeed, spawnRateMs]);

  return (
    <canvas
      ref={canvasRef}
      className="technityze-phc__pixel-trail"
      aria-hidden
    />
  );
}
