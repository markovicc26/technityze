"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  type PointerEventHandler,
  type ReactElement,
  type ReactNode,
} from "react";
import { useCursorInteraction } from "@/components/cursor/CursorContext";
import type { CursorStackEntry } from "@/components/cursor/cursorTypes";

export type CursorTargetVariant =
  | "cursor"
  | "permanent"
  | "accent"
  | "image"
  | "imageTr"
  | "link"
  | "opposite";

const variantClass: Record<CursorTargetVariant, string> = {
  cursor: "active-cursor",
  permanent: "active-cursor-permanent",
  accent: "active-cursor-accent",
  image: "active-cursor-image",
  imageTr: "active-cursor-image-tr",
  link: "btn-link",
  opposite: "bg-color-opposite",
};

function buildEntry(
  variant: CursorTargetVariant,
  cursorText?: string,
  cursorImage?: string,
): CursorStackEntry | null {
  switch (variant) {
    case "opposite":
      return { type: "opposite" };
    case "link":
      return { type: "link" };
    case "image":
      return cursorImage
        ? { type: "image", src: cursorImage, transparent: false }
        : null;
    case "imageTr":
      return cursorImage
        ? { type: "image", src: cursorImage, transparent: true }
        : null;
    case "permanent":
      return { type: "text", variant: "permanent", text: cursorText ?? "" };
    case "accent":
      return { type: "text", variant: "accent", text: cursorText ?? "" };
    default:
      return { type: "text", variant: "default", text: cursorText ?? "" };
  }
}

type ChildProps = {
  className?: string;
  onPointerEnter?: PointerEventHandler;
  onPointerLeave?: PointerEventHandler;
  "data-cursor-text"?: string;
  "data-cursor-image"?: string;
};

function chainPointer(
  a: PointerEventHandler | undefined,
  b: PointerEventHandler,
): PointerEventHandler {
  return (e) => {
    a?.(e);
    b(e);
  };
}

export type CursorTargetProps = {
  variant: CursorTargetVariant;
  cursorText?: string;
  cursorImage?: string;
  className?: string;
  children: ReactNode;
};

export default function CursorTarget({
  variant,
  cursorText,
  cursorImage,
  className,
  children,
}: CursorTargetProps) {
  const { push, pop } = useCursorInteraction();
  const entry = buildEntry(variant, cursorText, cursorImage);

  const enter = () => {
    if (!entry) return;
    push(entry);
  };

  const leave = () => {
    if (!entry) return;
    pop();
  };

  const mergedClass = [variantClass[variant], className].filter(Boolean).join(" ");

  if (Children.count(children) !== 1 || !isValidElement(children)) {
    return (
      <span
        className={mergedClass}
        data-cursor-text={cursorText}
        data-cursor-image={cursorImage}
        onPointerEnter={enter}
        onPointerLeave={leave}
      >
        {children}
      </span>
    );
  }

  const child = children as ReactElement<ChildProps>;

  return cloneElement(child, {
    className: [child.props.className, mergedClass].filter(Boolean).join(" "),
    "data-cursor-text": cursorText ?? child.props["data-cursor-text"],
    "data-cursor-image": cursorImage ?? child.props["data-cursor-image"],
    onPointerEnter: chainPointer(child.props.onPointerEnter, enter),
    onPointerLeave: chainPointer(child.props.onPointerLeave, leave),
  });
}
