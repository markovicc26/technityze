"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { PixelTrail } from "@/components/animations/PixelTrail";

/* Visual-only variant of the home-page ProductHighlightCard - reuses the
   same grid background, pixel trail and 3D tilt + pixel art image, but
   drops the category badge / title / description because /services puts
   that content in the left column of the scroll-pinned stack. Adds:
     - Tech stack pixel chips below the icon (always visible)
     - Hover-revealed terminal command at the bottom (brand tie to
       MeetTheOps terminal from the home page) */
type ServiceVisualCardProps = {
  imageSrc: string;
  imageAlt: string;
  techStack: string[];
  terminalCommand: string;
};

export function ServiceVisualCard({
  imageSrc,
  imageAlt,
  techStack,
  terminalCommand,
}: ServiceVisualCardProps) {
  const mouseX = useMotionValue(175);
  const mouseY = useMotionValue(175);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - left) / width) * 350);
    mouseY.set(((e.clientY - top) / height) * 350);
  };

  const rotateX = useTransform(mouseY, [0, 350], [8, -8]);
  const rotateY = useTransform(mouseX, [0, 350], [-8, 8]);

  const springConfig = { stiffness: 300, damping: 20 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(175);
        mouseY.set(175);
      }}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
      }}
      className="technityze-phc technityze-svc"
    >
      <div
        className="technityze-phc__inner technityze-svc__inner"
        style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
      >
        <div className="technityze-phc__grid-bg" aria-hidden />

        <PixelTrail color="#6B1FD6" pixelSize={8} fadeSpeed={0.028} />

        <motion.div
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="technityze-phc__image technityze-svc__image"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={imageAlt}
            className="technityze-phc__image-light"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc.replace(".png", "-dark.png")}
            alt=""
            aria-hidden
            className="technityze-phc__image-dark"
          />
        </motion.div>

        <div className="technityze-svc__stack" aria-hidden>
          {techStack.map((t) => (
            <span key={t} className="technityze-svc__chip">
              {t}
            </span>
          ))}
        </div>

        <div className="technityze-svc__terminal" aria-hidden>
          <span className="technityze-svc__terminal-prompt">$</span>
          <span className="technityze-svc__terminal-cmd">
            {terminalCommand}
          </span>
          <span className="technityze-svc__terminal-cursor" />
        </div>
      </div>
    </motion.div>
  );
}
