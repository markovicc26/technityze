"use client";

import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  type ComponentPropsWithoutRef,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type ServicesStackPart =
  | "card"
  | "wrapper"
  | "title"
  | "descr"
  | "tags"
  | "image";

type ServicesStackContextValue = {
  register: (part: ServicesStackPart, index: number) => (el: HTMLElement | null) => void;
};

const ServicesStackContext = createContext<ServicesStackContextValue | null>(
  null,
);

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (value: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") ref(value);
      else (ref as { current: T | null }).current = value;
    });
  };
}

function withMergedRef(
  children: ReactNode,
  refCb: (el: HTMLElement | null) => void,
): ReactNode {
  if (!isValidElement(children)) return children;
  const el = children as ReactElement<{ ref?: Ref<HTMLElement> }>;
  return cloneElement(el, { ref: mergeRefs(el.props.ref, refCb) });
}

function collectCards(cardRefs: MutableRefObject<Array<HTMLElement | null>>) {
  const cards: HTMLElement[] = [];
  const indices: number[] = [];
  const raw = cardRefs.current;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (c) {
      cards.push(c);
      indices.push(i);
    }
  }
  return { cards, indices };
}

export default function CommonServicesStack({
  children,
  ...rest
}: { children: ReactNode } & ComponentPropsWithoutRef<"div">) {
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const wrapperRefs = useRef<Array<HTMLElement | null>>([]);
  const titleRefs = useRef<Array<HTMLElement | null>>([]);
  const descrRefs = useRef<Array<HTMLElement | null>>([]);
  const tagsRefs = useRef<Array<HTMLElement | null>>([]);
  const imageRefs = useRef<Array<HTMLElement | null>>([]);

  const ctxValue = useMemo<ServicesStackContextValue>(
    () => ({
      register: (part, index) => (el) => {
        switch (part) {
          case "card":
            cardRefs.current[index] = el;
            break;
          case "wrapper":
            wrapperRefs.current[index] = el;
            break;
          case "title":
            titleRefs.current[index] = el;
            break;
          case "descr":
            descrRefs.current[index] = el;
            break;
          case "tags":
            tagsRefs.current[index] = el;
            break;
          case "image":
            imageRefs.current[index] = el;
            break;
        }
      },
    }),
    [],
  );

  useLayoutEffect(() => {
    let cancelled = false;
    const cleanups: Array<() => void> = [];
    const tweenTargets: HTMLElement[] = [];

    function animateTitleIn(titleEl: HTMLElement) {
      gsap.to(titleEl, {
        yPercent: 0,
        duration: 0.75,
        ease: "common",
        overwrite: "auto",
      });
    }

    function animateTitleOut(titleEl: HTMLElement) {
      gsap.to(titleEl, {
        yPercent: 100,
        duration: 0.5,
        ease: "common",
      });
    }

    function animateDescrIn(descrEl: HTMLElement, tagsEl: HTMLElement) {
      gsap.to(descrEl, {
        y: 0,
        opacity: 1,
        duration: 0.75,
        ease: "common",
      });
      gsap.to(tagsEl, {
        opacity: 1,
        duration: 0.75,
        ease: "common",
      });
    }

    function animateDescrOut(descrEl: HTMLElement, tagsEl: HTMLElement) {
      gsap.to(descrEl, {
        y: 24,
        opacity: 0,
        duration: 0.3,
        ease: "common",
      });
      gsap.to(tagsEl, {
        opacity: 0,
        duration: 0.3,
        ease: "common",
      });
    }

    function syncTitleY(cardList: HTMLElement[], titleEls: HTMLElement[]) {
      if (!cardList.length) return;
      const vh = window.innerHeight;
      const revealY = vh * 0.4;
      cardList.forEach((card, i) => {
        const titleEl = titleEls[i];
        if (!titleEl) return;
        const top = card.getBoundingClientRect().top;
        if (top >= revealY) {
          gsap.set(titleEl, { yPercent: 100 });
          return;
        }
        if (gsap.isTweening(titleEl)) return;
        const yp = Number(gsap.getProperty(titleEl, "yPercent") ?? 0);
        if (Number.isNaN(yp) || yp > 0.1) {
          animateTitleIn(titleEl);
        } else {
          gsap.set(titleEl, { yPercent: 0 });
        }
      });
    }

    const runSetup = () => {
      if (cancelled) return;

      const { cards, indices } = collectCards(cardRefs);
      if (!cards.length) return;

      const lastCard = cards[cards.length - 1];

      const titleEls: HTMLElement[] = [];
      const descrEls: HTMLElement[] = [];

      for (let index = 0; index < cards.length; index++) {
        const slot = indices[index];
        const title = titleRefs.current[slot];
        const descr = descrRefs.current[slot];
        if (!title || !descr) return;
        titleEls.push(title);
        descrEls.push(descr);
      }

      titleEls.forEach((titleEl) => {
        gsap.set(titleEl, {
          overflow: "hidden",
          display: "block",
          willChange: "transform",
        });
        gsap.set(titleEl, { yPercent: 100 });
      });
      descrEls.forEach((descrEl) => {
        gsap.set(descrEl, { y: 24, opacity: 0 });
      });

      cards.forEach((card, index) => {
        const isLast = index === cards.length - 1;
        const pinSt = ScrollTrigger.create({
          trigger: card,
          start: "top top",
          end: isLast ? "+=100vh" : "top top",
          endTrigger: isLast ? undefined : lastCard,
          pin: true,
          pinSpacing: isLast,
        });
        cleanups.push(() => pinSt.kill());
      });

      cards.forEach((_, index) => {
        if (index >= cards.length - 1) return;
        const slot = indices[index];
        const wrapper = wrapperRefs.current[slot];
        if (!wrapper) return;
        const st = ScrollTrigger.create({
          trigger: cards[index + 1],
          start: "top bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            gsap.set(wrapper, {
              scale: 1 - self.progress * 0.15,
              opacity: 1 - self.progress,
            });
          },
        });
        cleanups.push(() => st.kill());
      });

      cards.forEach((card, index) => {
        const slot = indices[index];
        const imageHost = imageRefs.current[slot];
        const img = imageHost?.querySelector("img");
        if (!img) return;
        gsap.set(img, { scale: 1.4 });
        const st = ScrollTrigger.create({
          trigger: card,
          start: "top bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            gsap.set(img, { scale: 1.4 - self.progress * 0.4 });
          },
        });
        cleanups.push(() => st.kill());
      });

      cards.forEach((card, index) => {
        const slot = indices[index];
        const tagsEl = tagsRefs.current[slot];
        const titleEl = titleEls[index];
        const descrEl = descrEls[index];
        if (!tagsEl || !titleEl || !descrEl) return;

        tweenTargets.push(titleEl, descrEl, tagsEl);

        const inTitle = ScrollTrigger.create({
          trigger: card,
          start: "top 40%",
          onEnter: () => animateTitleIn(titleEl),
          onEnterBack: () => {
            if (index === 0) {
              gsap.set(titleEl, { yPercent: 0 });
            } else {
              animateTitleIn(titleEl);
            }
          },
          onLeaveBack: () => {
            if (index === 0) {
              gsap.set(titleEl, { yPercent: 0 });
              return;
            }
            animateTitleOut(titleEl);
          },
        });
        const inDescr = ScrollTrigger.create({
          trigger: card,
          start: "top top",
          onEnter: () => animateDescrIn(descrEl, tagsEl),
          onLeaveBack: () => animateDescrOut(descrEl, tagsEl),
        });
        cleanups.push(() => {
          inTitle.kill();
          inDescr.kill();
        });
      });

      const onStRefresh = () => {
        if (cancelled) return;
        const { cards: c } = collectCards(cardRefs);
        if (c.length && titleEls.length) {
          syncTitleY(c, titleEls);
        }
      };
      ScrollTrigger.addEventListener("refresh", onStRefresh);
      cleanups.push(() => {
        ScrollTrigger.removeEventListener("refresh", onStRefresh);
      });
      ScrollTrigger.refresh();
      requestAnimationFrame(() => {
        if (cancelled) return;
        ScrollTrigger.refresh();
      });
    };

    let raf1 = 0;
    let raf2 = 0;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(runSetup);
      });
    });

    const onLoad = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };
    window.addEventListener("load", onLoad);
    cleanups.push(() => window.removeEventListener("load", onLoad));

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      cleanups.forEach((fn) => fn());
      gsap.killTweensOf(tweenTargets);
      titleRefs.current.forEach((t) => {
        if (t) gsap.set(t, { clearProps: "transform,overflow,willChange" });
      });
      descrRefs.current.forEach((d) => {
        if (d) gsap.set(d, { clearProps: "transform,opacity,willChange" });
      });
      tagsRefs.current.forEach((g) => {
        if (g) gsap.set(g, { clearProps: "opacity,willChange" });
      });
    };
  }, []);

  return (
    <ServicesStackContext.Provider value={ctxValue}>
      <div {...rest}>{children}</div>
    </ServicesStackContext.Provider>
  );
}

/** Merges a ref with the services stack for GSAP (one slot per part per card). */
export function ServicesStackSlot({
  part,
  index,
  children,
}: {
  part: ServicesStackPart;
  index: number;
  children: ReactNode;
}) {
  const ctx = useContext(ServicesStackContext);
  if (!ctx) return children;
  return withMergedRef(children, ctx.register(part, index));
}
