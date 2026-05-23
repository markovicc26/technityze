"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type StackCardMedia = HTMLImageElement | HTMLVideoElement;

export type StackCardsRefs = {
  cards: HTMLDivElement[];
  cardWrappers: HTMLDivElement[];
  cardDescriptions: HTMLDivElement[];
  cardTitleParagraphs: HTMLParagraphElement[];
  cardCovers: HTMLDivElement[];
  cardImageWrappers: HTMLDivElement[];
  cardMedias: StackCardMedia[];
  introMarquee: HTMLDivElement | null;
};

function marquee(
  item: gsap.TweenTarget,
  time: number,
  direction: string,
): gsap.core.Tween {
  const mod = gsap.utils.wrap(0, 50);
  return gsap.to(item, {
    duration: time,
    ease: "none",
    x: direction,
    modifiers: {
      x: (x) => mod(parseFloat(x)) + "%",
    },
    repeat: -1,
  });
}

function getBaseSize(): number {
  const w = window.innerWidth;
  if (w >= 1600) return 460;
  if (w >= 1024) return 400;
  return Math.min(w - 60, 390);
}

/** Whole title block only — no SplitText inside React-managed headings. */
function animateContentIn(
  titleEl: HTMLElement | null,
  description: HTMLElement | null,
): void {
  if (titleEl) {
    gsap.to(titleEl, {
      yPercent: 0,
      duration: 0.75,
      ease: "common",
    });
  }
  if (description) {
    gsap.to(description, {
      y: 0,
      opacity: 1,
      duration: 0.75,
      delay: 0.1,
      ease: "common",
    });
  }
}

function animateContentOut(
  titleEl: HTMLElement | null,
  description: HTMLElement | null,
): void {
  if (titleEl) {
    gsap.to(titleEl, { yPercent: 100, duration: 0.5, ease: "common" });
  }
  if (description) {
    gsap.to(description, {
      y: 40,
      opacity: 0,
      duration: 0.1,
      ease: "common",
    });
  }
}

export function initVelocityMarqueeRows(
  topRows: HTMLDivElement[],
  bottomRows: HTMLDivElement[],
): () => void {
  const tops = topRows.filter(Boolean);
  const bottoms = bottomRows.filter(Boolean);
  if (!tops.length || !bottoms.length) return () => {};

  const master = gsap
    .timeline()
    .add(marquee(tops, 70, "-=50%"), 0)
    .add(marquee(bottoms, 70, "+=50%"), 0);

  const tween = gsap.to(master, {
    duration: 1.5,
    timeScale: 1,
    paused: true,
  });

  const timeScaleClamp = gsap.utils.clamp(1, 6);
  const st = ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      master.timeScale(timeScaleClamp(Math.abs(self.getVelocity() / 200)));
      tween.invalidate().restart();
    },
  });

  return () => {
    st.kill();
    tween.kill();
    master.kill();
  };
}

export function initStackCardsEffects(refs: StackCardsRefs): () => void {
  let disposed = false;
  let cleanup: (() => void) | null = null;

  const setup = () => {
    const cards = refs.cards.filter(Boolean);
    if (!cards.length) return () => {};

    refs.cardTitleParagraphs.forEach((titleEl) => {
      if (!titleEl) return;
      gsap.set(titleEl, {
        overflow: "hidden",
        display: "block",
        willChange: "transform",
        yPercent: 100,
      });
    });

    refs.cardDescriptions.forEach((descr, index) => {
      if (index > 0 && descr) gsap.set(descr, { y: 40, opacity: 0 });
    });

    const introImageWrapper = refs.cardImageWrappers[0];
    const introImage = refs.cardMedias[0];
    const introCover = refs.cardCovers[0];
    const introMarquee = refs.introMarquee;
    if (!introImageWrapper || !introImage || !introCover || !introMarquee) {
      return () => {};
    }

    let baseSize = getBaseSize();
    let lastProgress = 0;
    let introRevealed = false;

    const updateClip = (progress: number) => {
      const cutY = ((window.innerHeight - baseSize) / 2) * (1 - progress);
      const cutX = ((window.innerWidth - baseSize) / 2) * (1 - progress);
      gsap.set(introImageWrapper, {
        clipPath: `inset(${cutY}px ${cutX}px ${cutY}px ${cutX}px)`,
      });
    };

    updateClip(0);
    gsap.set(introImage, { scale: 0.9 });
    gsap.set(introCover, { opacity: 0 });

    const triggers: ScrollTrigger[] = [];

    triggers.push(
      ScrollTrigger.create({
        trigger: cards[0],
        start: "top top",
        end: "+=300vh",
        onUpdate: (self) => {
          lastProgress = self.progress;
          updateClip(lastProgress);

          const innerImgScale = 0.9 + self.progress * 0.1;
          const innerCoverOpacity = self.progress;
          gsap.set(introImage, { scale: innerImgScale });
          gsap.set(introCover, { opacity: innerCoverOpacity });

          if (innerCoverOpacity >= 0.4 && innerCoverOpacity <= 0.75) {
            const fadeProgress = (innerCoverOpacity - 0.4) / (0.75 - 0.4);
            gsap.set(introMarquee, { opacity: 1 - fadeProgress });
          } else if (innerCoverOpacity < 0.4) {
            gsap.set(introMarquee, { opacity: 1 });
          } else {
            gsap.set(introMarquee, { opacity: 0 });
          }

          if (lastProgress >= 1 && !introRevealed) {
            introRevealed = true;
            animateContentIn(
              refs.cardTitleParagraphs[0] ?? null,
              refs.cardDescriptions[0] ?? null,
            );
          }
          if (lastProgress < 1 && introRevealed) {
            introRevealed = false;
            animateContentOut(
              refs.cardTitleParagraphs[0] ?? null,
              refs.cardDescriptions[0] ?? null,
            );
          }
        },
      }),
    );

    cards.forEach((card, index) => {
      const isLastCard = index === cards.length - 1;
      triggers.push(
        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          end: isLastCard ? "+=100vh" : "top top",
          endTrigger: isLastCard ? undefined : cards[cards.length - 1],
          pin: true,
          pinSpacing: isLastCard,
        }),
      );
    });

    cards.forEach((_, index) => {
      if (index >= cards.length - 1) return;
      const wrapper = refs.cardWrappers[index];
      const nextCard = cards[index + 1];
      if (!wrapper || !nextCard) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: nextCard,
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            gsap.set(wrapper, {
              scale: 1 - self.progress * 0.15,
              opacity: 1 - self.progress,
            });
          },
        }),
      );
    });

    cards.forEach((card, index) => {
      if (index === 0) return;
      const media = refs.cardMedias[index];
      if (!media) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: card,
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            gsap.set(media, { scale: 2 - self.progress });
          },
        }),
      );
    });

    cards.forEach((card, index) => {
      if (index === 0) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          onEnter: () =>
            animateContentIn(
              refs.cardTitleParagraphs[index] ?? null,
              refs.cardDescriptions[index] ?? null,
            ),
          onLeaveBack: () =>
            animateContentOut(
              refs.cardTitleParagraphs[index] ?? null,
              refs.cardDescriptions[index] ?? null,
            ),
        }),
      );
    });

    const onResize = () => {
      baseSize = getBaseSize();
      updateClip(lastProgress);
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      triggers.forEach((t) => t.kill());
      refs.cardTitleParagraphs.forEach((t) => {
        if (!t) return;
        gsap.killTweensOf(t);
        gsap.set(t, { clearProps: "transform,overflow,willChange" });
      });
      refs.cardDescriptions.forEach((d) => {
        if (!d) return;
        gsap.killTweensOf(d);
        gsap.set(d, { clearProps: "transform,opacity,willChange" });
      });
    };
  };

  const runWhenFontsReady = async () => {
    try {
      if (typeof document !== "undefined" && "fonts" in document) {
        await document.fonts.ready;
      }
    } catch {
      // Continue even if Font Loading API is unavailable.
    }
    if (disposed) return;
    cleanup = setup();
  };
  void runWhenFontsReady();

  return () => {
    disposed = true;
    cleanup?.();
  };
}
