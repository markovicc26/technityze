"use client";

import { useEffect, useRef } from "react";

/** Force-hides the global `.blur-container` overlay while this marker
 *  is in view. Use as a sibling above a section that should never sit
 *  behind the fixed blur strip (e.g. the footer).
 *
 *  Hero owns the blur container while the hero is on screen (via a
 *  MutationObserver that re-asserts display:block). To turn the blur
 *  off near the footer we flip its `__technityzeAllowBlurHide` flag,
 *  which both releases the observer and sets display:none. */
export default function HideGlobalBlur() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const container = document.querySelector<HTMLElement>(".blur-container");
    if (!container) return;

    const allowFn = (
      window as unknown as { __technityzeAllowBlurHide?: (v: boolean) => void }
    ).__technityzeAllowBlurHide;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            allowFn?.(true);
            container.style.display = "none";
          } else {
            allowFn?.(false);
            container.style.display = "block";
          }
        }
      },
      { rootMargin: "0px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} aria-hidden style={{ height: 1, width: 1 }} />;
}
