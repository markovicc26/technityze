"use client";

import {
  useLayoutEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link, { type LinkProps } from "next/link";

gsap.registerPlugin(ScrollTrigger);

/**
 * Text animations without SplitText / SplitType — those mutate React-owned DOM
 * and cause removeChild crashes during route transitions.
 * All tweens target the host element only (opacity / transform / filter).
 */
export type CommonTextAnimation =
  | "none"
  | "revealType"
  | "splitLines"
  | "splitLinesReverse"
  | "animChars"
  | "splitLinesLoad"
  | "animCharsLoad";

type CommonAnimatedTextProps<T extends ElementType = "p"> = {
  as?: T;
  className?: string;
  children: ReactNode;
  animation?: CommonTextAnimation;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

function killScrollTriggersForElement(el: HTMLElement): void {
  ScrollTrigger.getAll().forEach((st) => {
    if (st.trigger === el) st.kill();
  });
}

export default function CommonAnimatedText<T extends ElementType = "p">({
  as,
  className,
  children,
  animation = "none",
  ...rest
}: CommonAnimatedTextProps<T>) {
  const Tag = (as ?? "p") as ElementType;
  const elRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el || animation === "none") return;
    let cancelled = false;
    const tweens: gsap.core.Tween[] = [];
    const timelines: gsap.core.Timeline[] = [];

    const cleanup = () => {
      tweens.forEach((t) => t.kill());
      timelines.forEach((tl) => tl.kill());
      killScrollTriggersForElement(el);
      gsap.killTweensOf(el);
      gsap.set(el, {
        clearProps: "transform,opacity,filter,willChange,overflow",
      });
    };

    const boot = () => {
      if (cancelled) return;
      gsap.set(el, { overflow: "hidden", willChange: "transform,opacity,filter" });

      if (animation === "revealType") {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "top 60%",
            scrub: 1.4,
          },
        });
        tl.fromTo(
          el,
          { autoAlpha: 0, y: 28, filter: "blur(10px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", ease: "none" },
        );
        timelines.push(tl);
        return;
      }

      if (
        animation === "splitLines" ||
        animation === "splitLinesReverse" ||
        animation === "splitLinesLoad"
      ) {
        const fromY =
          animation === "splitLinesReverse"
            ? -48
            : animation === "splitLinesLoad"
              ? 36
              : 48;
        if (animation === "splitLinesLoad") {
          const tw = gsap.fromTo(
            el,
            { autoAlpha: 0, y: fromY, rotateX: 2 },
            {
              autoAlpha: 1,
              y: 0,
              rotateX: 0,
              duration: 0.65,
              ease: "custom",
            },
          );
          tweens.push(tw);
          return;
        }
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "top 90%",
            toggleActions: "none play none reset",
          },
        });
        tl.fromTo(
          el,
          { autoAlpha: 0, y: fromY },
          { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" },
        );
        timelines.push(tl);
        return;
      }

      if (animation === "animChars" || animation === "animCharsLoad") {
        if (animation === "animCharsLoad") {
          const tw = gsap.fromTo(
            el,
            { autoAlpha: 0, y: 32, scale: 0.98 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.65,
              ease: "custom",
            },
          );
          tweens.push(tw);
          return;
        }
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "top 80%",
            toggleActions: "none play none reset",
          },
        });
        tl.fromTo(
          el,
          { autoAlpha: 0, y: 36 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "custom" },
        );
        timelines.push(tl);
      }
    };

    let booted = false;
    const bootOnce = () => {
      if (cancelled || booted) return;
      booted = true;
      boot();
      ScrollTrigger.refresh();
    };

    const delayedRefreshId = window.setTimeout(() => {
      if (!cancelled) ScrollTrigger.refresh();
    }, 300);

    const rafId = requestAnimationFrame(() => bootOnce());

    if ("fonts" in document) {
      void document.fonts.ready.then(() => {
        requestAnimationFrame(() => bootOnce());
      });
    }

    return () => {
      cancelled = true;
      window.clearTimeout(delayedRefreshId);
      cancelAnimationFrame(rafId);
      cleanup();
    };
  }, [animation]);

  return (
    <Tag
      className={className}
      data-common-animated={animation !== "none" ? "1" : undefined}
      {...rest}
      ref={(node: HTMLElement | null) => {
        elRef.current = node;
      }}
    >
      {children}
    </Tag>
  );
}

type CommonAnimatedTextLinkProps = Omit<LinkProps, "as"> &
  Omit<ComponentPropsWithoutRef<"a">, "href"> & {
    children: ReactNode;
    animation?: CommonTextAnimation;
    className?: string;
  };

export function CommonAnimatedTextLink({
  children,
  animation = "none",
  className,
  ...rest
}: CommonAnimatedTextLinkProps) {
  return (
    <CommonAnimatedText
      as={Link}
      className={className}
      animation={animation}
      {...rest}
    >
      {children}
    </CommonAnimatedText>
  );
}
