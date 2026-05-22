"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { PixelTrail } from "@/components/animations/PixelTrail";

type ProductHighlightCardProps = {
  categoryIcon: React.ReactNode;
  category: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
};

export function ProductHighlightCard({
  categoryIcon,
  category,
  title,
  description,
  imageSrc,
  imageAlt,
  className,
}: ProductHighlightCardProps) {
  // Start at the center (175) so the card sits flat until the cursor
  // enters. With initial 0 the transform would compute a 10deg tilt on
  // page load.
  const mouseX = useMotionValue(175);
  const mouseY = useMotionValue(175);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - left) / width) * 350);
    mouseY.set(((e.clientY - top) / height) * 350);
  };

  const rotateX = useTransform(mouseY, [0, 350], [10, -10]);
  const rotateY = useTransform(mouseX, [0, 350], [-10, 10]);

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
      className={`technityze-phc ${className ?? ""}`.trim()}
    >
      <div
        className="technityze-phc__inner"
        style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
      >
        <div className="technityze-phc__grid-bg" aria-hidden />

        <PixelTrail color="#6B1FD6" pixelSize={8} fadeSpeed={0.028} />

        <div className="technityze-phc__content">
          <div className="technityze-phc__category">
            <span className="technityze-phc__icon">{categoryIcon}</span>
            <span className="technityze-phc__category-label">{category}</span>
          </div>

          <div className="technityze-phc__text">
            <h3 className="technityze-phc__title">{title}</h3>
            <p className="technityze-phc__desc">{description}</p>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="technityze-phc__image"
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
      </div>
    </motion.div>
  );
}
