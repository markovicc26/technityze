"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, type RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

type StickyMediaSectionRefs = {
  sectionRef: RefObject<HTMLElement | null>;
  stickyRef: RefObject<HTMLElement | null>;
  overflowRefs: RefObject<HTMLElement[]>;
  titleRefs: RefObject<HTMLElement[]>;
  numberBlockRef: RefObject<HTMLElement | null>;
  counterCurrentRef: RefObject<HTMLElement | null>;
  counterTotalRef: RefObject<HTMLElement | null>;
  btnHolderRef: RefObject<HTMLElement | null>;
  progressRef: RefObject<HTMLElement | null>;
  imageRefs: RefObject<HTMLImageElement[]>;
};

const FULL = "inset(0% round 0%)";
const CLIPPED = "inset(50% round 0%)";

const formatIndex = (i: number) => String(i).padStart(2, "0");

function debounce(fn: () => void, wait = 120) {
  let t: ReturnType<typeof setTimeout> | null = null;
  return () => {
    if (t) clearTimeout(t);
    t = setTimeout(fn, wait);
  };
}

function waitForImages(images: HTMLImageElement[]) {
  if (!images.length) return Promise.resolve();
  return Promise.all(
    images.map((img) => {
      if (img.complete && (img.naturalWidth || img.naturalHeight))
        return Promise.resolve();
      if (img.decode) return img.decode().catch(() => {});
      return new Promise<void>((res) => {
        img.onload = () => res();
        img.onerror = () => res();
      });
    }),
  );
}

export function useStickyMediaSection({
  sectionRef,
  stickyRef,
  overflowRefs,
  titleRefs,
  numberBlockRef,
  counterCurrentRef,
  counterTotalRef,
  btnHolderRef,
  progressRef,
  imageRefs,
}: StickyMediaSectionRefs): void {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const overflows = overflowRefs.current.filter(Boolean);
    const titles = titleRefs.current.filter(Boolean);
    const numberBlock = numberBlockRef.current;
    const counterCurrent = counterCurrentRef.current;
    const counterTotal = counterTotalRef.current;
    const btnHolder = btnHolderRef.current;
    const progressEl = progressRef.current;
    const images = imageRefs.current.filter(Boolean);

    if (!section || !sticky || !overflows.length || !titles.length) return;
    if (!numberBlock || !counterCurrent || !counterTotal) return;

    const imagesCount = overflows.length;
    const steps = Math.max(0, imagesCount - 1);
    counterTotal.textContent = formatIndex(imagesCount);

    let cancelled = false;
    let st: ScrollTrigger | null = null;
    let onRefreshHandler: (() => void) | null = null;
    let onResize: (() => void) | null = null;

    const setInitialState = () => {
      overflows.forEach((ovf, i) => {
        gsap.set(ovf, {
          clipPath: i === 0 ? FULL : CLIPPED,
          autoAlpha: 1,
          willChange: "clip-path, opacity, transform",
          pointerEvents: "none",
        });
      });

      titles.forEach((t) => gsap.set(t, { autoAlpha: 1, yPercent: 100 }));
      gsap.set(numberBlock, { autoAlpha: 0, y: 8 });
      if (btnHolder) gsap.set(btnHolder, { autoAlpha: 0, y: 8 });
      if (progressEl)
        gsap.set(progressEl, { transformOrigin: "left center", scaleX: 0 });
    };

    const computeTotalScroll = () =>
      steps * (window.innerHeight || document.documentElement.clientHeight);

    const applySectionHeight = (totalScroll: number) => {
      const stickyH = sticky.getBoundingClientRect().height || window.innerHeight;
      section.style.minHeight = `${stickyH + totalScroll}px`;
    };

    void waitForImages(images)
      .then(() => {
        if (cancelled) return;

        setInitialState();

        if (imagesCount < 2) {
          const tlShort = gsap.timeline();
          tlShort.to(numberBlock, { duration: 0.36, autoAlpha: 1, y: 0 });
          tlShort.to(titles[0], { duration: 0.36, yPercent: 0 }, "-=0.26");
          if (btnHolder) {
            tlShort.to(
              btnHolder,
              { duration: 0.36, autoAlpha: 1, y: 0 },
              "-=0.26",
            );
          }
          return;
        }

        const initialScroll = computeTotalScroll();
        applySectionHeight(initialScroll);

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          paused: true,
        });

        tl.to(numberBlock, { duration: 0.32, autoAlpha: 1, y: 0 }, 0);
        tl.to(titles[0], { duration: 0.32, yPercent: 0 }, 0.05);
        if (btnHolder) {
          tl.to(btnHolder, { duration: 0.32, autoAlpha: 1, y: 0 }, 0.05);
        }

        for (let i = 1; i < imagesCount; i++) {
          tl.to(overflows[i], { duration: 0.6, clipPath: FULL }, "+=0.12");
          tl.to(titles[i - 1], { duration: 0.28, yPercent: -100 }, "-=0.48");
          tl.to(titles[i], { duration: 0.28, yPercent: 0 }, "<");
        }

        st = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=${initialScroll}`,
          scrub: 0.6,
          pin: sticky,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          animation: tl,
          onUpdate(self) {
            if (progressEl) {
              gsap.to(progressEl, {
                scaleX: self.progress,
                duration: 0.12,
                ease: "custom",
              });
            }
            const idx = Math.round(self.progress * steps);
            counterCurrent.textContent = formatIndex(
              Math.min(imagesCount, idx + 1),
            );
          },
        });

        onRefreshHandler = () => {
          const newScroll = computeTotalScroll();
          applySectionHeight(newScroll);
          if (!st) return;
          st.vars.end = `+=${newScroll}`;
          st.refresh();
          tl.pause();
          tl.progress(st.progress, false);
        };
        ScrollTrigger.addEventListener("refresh", onRefreshHandler);

        onResize = debounce(() => {
          ScrollTrigger.refresh();
        }, 150);
        window.addEventListener("resize", onResize);

        ScrollTrigger.refresh();
      })
      .catch(() => {
        if (!cancelled) setInitialState();
      });

    return () => {
      cancelled = true;
      st?.kill();
      if (onRefreshHandler) {
        ScrollTrigger.removeEventListener("refresh", onRefreshHandler);
      }
      if (onResize) {
        window.removeEventListener("resize", onResize);
      }
    };
  }, [
    sectionRef,
    stickyRef,
    overflowRefs,
    titleRefs,
    numberBlockRef,
    counterCurrentRef,
    counterTotalRef,
    btnHolderRef,
    progressRef,
    imageRefs,
  ]);
}
