"use client";

import { gsap } from "gsap";
import type Lenis from "lenis";

export type MxdMenuGsapMenuRow = {
  item: HTMLLIElement;
  toggle: HTMLDivElement;
  submenu: HTMLUListElement | null;
};

/** All DOM targets for menu GSAP — supplied via React refs (no `querySelector`). */
export type MxdMenuGsapElements = {
  nav: HTMLElement;
  toggle: HTMLElement;
  backdrop: HTMLElement;
  overlay: HTMLElement;
  content: HTMLElement;
  mediaWrapper: HTMLElement | null;
  hamburger: HTMLElement | null;
  headerSplitElements: HTMLElement[];
  mainMenuLinkSpans: HTMLElement[];
  contactAnchors: HTMLElement[];
  contactRevealTargets: HTMLElement[];
  footerSplitElements: HTMLElement[];
  dividers: HTMLElement[];
  arrows: HTMLElement[];
  menuRows: MxdMenuGsapMenuRow[];
};

/** GSAP does not treat `webkitBackdropFilter` as a valid tween prop — set blur via CSS. */
function setBackdropFilterCss(el: HTMLElement, value: string) {
  el.style.setProperty("backdrop-filter", value);
  el.style.setProperty("-webkit-backdrop-filter", value);
}

/** Whole-node reveals only (no SplitText) so React never fights mutated text DOM. */
function prepTextRevealTargets(els: HTMLElement[]): HTMLElement[] {
  if (!els.length) return [];
  els.forEach((el) => {
    const blockish =
      el.tagName === "P" ||
      el.tagName === "H1" ||
      el.tagName === "H2" ||
      el.tagName === "H3";
    gsap.set(el, {
      display: blockish ? "block" : "inline-block",
      overflow: "hidden",
      verticalAlign: "top",
      willChange: "transform",
    });
  });
  gsap.set(els, { yPercent: 110 });
  return els;
}

function concatTargets(
  header: HTMLElement[],
  main: HTMLElement[],
  footer: HTMLElement[],
): HTMLElement[] {
  return [...header, ...main, ...footer];
}

function resetSubmenus(rows: MxdMenuGsapMenuRow[]): void {
  rows.forEach(({ item, submenu }) => {
    if (!submenu) return;
    gsap.killTweensOf(submenu);
    submenu.style.display = "none";
    gsap.set(submenu, { clearProps: "height,overflow" });
    item.classList.remove("open");
  });
}

function animateSubmenuOpen(sub: HTMLElement, item: HTMLElement): void {
  gsap.killTweensOf(sub);
  item.classList.add("open");
  sub.style.display = "block";
  gsap.set(sub, { height: 0, overflow: "hidden" });
  const targetH = sub.scrollHeight;
  gsap.to(sub, {
    height: targetH,
    duration: 0.4,
    ease: "power2.out",
    onComplete: () => {
      gsap.set(sub, { height: "auto", overflow: "visible" });
    },
  });
}

function animateSubmenuClose(sub: HTMLElement, item: HTMLElement): void {
  gsap.killTweensOf(sub);
  const h = sub.offsetHeight;
  if (h <= 0) {
    sub.style.display = "none";
    item.classList.remove("open");
    gsap.set(sub, { clearProps: "height,overflow" });
    return;
  }
  gsap.set(sub, { height: h, overflow: "hidden" });
  gsap.to(sub, {
    height: 0,
    duration: 0.35,
    ease: "power2.in",
    onComplete: () => {
      sub.style.display = "none";
      item.classList.remove("open");
      gsap.set(sub, { clearProps: "height,overflow" });
    },
  });
}

export function bindMxdMenuGsap(
  el: MxdMenuGsapElements,
  lenis: Lenis | null,
): {
  resetMenu: () => void;
  closeMenuAnimated: () => void;
  dispose: () => void;
} {
  const {
    nav,
    toggle,
    backdrop: menuBackdrop,
    overlay: menuOverlay,
    content: menuOverlayContainer,
    mediaWrapper: menuMediaWrapper,
    hamburger: hamburgerIcon,
    headerSplitElements,
    mainMenuLinkSpans,
    contactAnchors,
    contactRevealTargets,
    footerSplitElements,
    dividers: menuDividers,
    arrows: menuArrows,
    menuRows,
  } = el;

  const headerTargets = prepTextRevealTargets(headerSplitElements);
  const mainTargets = prepTextRevealTargets(mainMenuLinkSpans);
  const footerTargets = prepTextRevealTargets(footerSplitElements);
  const allTextTargets = concatTargets(
    headerTargets,
    mainTargets,
    footerTargets,
  );

  gsap.set(contactAnchors, { display: "block", overflow: "hidden" });
  gsap.set(contactRevealTargets, { display: "inline-block", yPercent: 110 });

  gsap.set(menuDividers, { clipPath: "inset(0% 100% 0% 0%)" });
  gsap.set(menuArrows, { opacity: 0 });
  if (menuMediaWrapper) {
    gsap.set(menuMediaWrapper, { scale: 1.4 });
  }

  gsap.set(menuOverlay, {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
  });
  gsap.set(menuBackdrop, {
    background: "rgba(var(--base-rgb), 0)",
  });
  setBackdropFilterCss(menuBackdrop, "blur(0px)");
  gsap.set(menuOverlayContainer, { yPercent: -50 });

  let isMenuOpen = false;
  let isAnimating = false;
  let activeTimeline: gsap.core.Timeline | null = null;

  const killTimeline = () => {
    activeTimeline?.kill();
    activeTimeline = null;
  };

  const resetMenu = () => {
    killTimeline();
    gsap.set([menuOverlay, menuOverlayContainer, menuBackdrop], {
      willChange: "auto",
    });
    gsap.set(menuOverlay, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    });
    gsap.set(menuBackdrop, {
      background: "rgba(var(--base-rgb), 0)",
    });
    setBackdropFilterCss(menuBackdrop, "blur(0px)");
    gsap.set(menuOverlayContainer, { yPercent: -50 });
    if (menuMediaWrapper) {
      gsap.set(menuMediaWrapper, { scale: 1.4 });
    }

    gsap.set(allTextTargets, { yPercent: 110 });
    gsap.set(contactRevealTargets, { display: "inline-block", yPercent: 110 });
    gsap.set(menuDividers, { clipPath: "inset(0% 100% 0% 0%)" });
    gsap.set(menuArrows, { opacity: 0 });

    hamburgerIcon?.classList.remove("active");
    resetSubmenus(menuRows);

    isMenuOpen = false;
    isAnimating = false;
    lenis?.start();
  };

  const closeMenuAnimated = () => {
    if (!isMenuOpen || isAnimating) return;
    killTimeline();
    const tl = gsap.timeline({
      onStart: () => {
        isAnimating = true;
      },
      onComplete: () => {
        isAnimating = false;
        activeTimeline = null;
      },
    });
    activeTimeline = tl;

    hamburgerIcon?.classList.remove("active");
    tl.to(menuOverlay, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 0.5,
      ease: "power3.inOut",
    })
      .to(
        menuBackdrop,
        {
          background: "rgba(var(--base-rgb), 0)",
          duration: 0.35,
          ease: "power2.in",
        },
        "<",
      )
      .to(
        menuOverlayContainer,
        {
          yPercent: -50,
          duration: 0.5,
          ease: "power3.inOut",
        },
        "<",
      )
      .call(() => {
        setBackdropFilterCss(menuBackdrop, "blur(0px)");
        gsap.set([menuOverlay, menuOverlayContainer, menuBackdrop], {
          willChange: "auto",
        });
        gsap.set(allTextTargets, { yPercent: 110 });
        gsap.set(contactRevealTargets, {
          display: "inline-block",
          yPercent: 110,
        });
        gsap.set(menuDividers, { clipPath: "inset(0% 100% 0% 0%)" });
        gsap.set(menuArrows, { opacity: 0 });
        if (menuMediaWrapper) {
          gsap.set(menuMediaWrapper, { scale: 1.4 });
        }
        resetSubmenus(menuRows);
        lenis?.start();
      });
    isMenuOpen = false;
  };

  const onToggleClick = (e: Event) => {
    e.preventDefault();
    if (isAnimating) return;

    killTimeline();
    const tl = gsap.timeline({
      onStart: () => {
        isAnimating = true;
      },
      onComplete: () => {
        isAnimating = false;
        activeTimeline = null;
      },
    });
    activeTimeline = tl;

    if (!isMenuOpen) {
      lenis?.stop();
      hamburgerIcon?.classList.add("active");
      const isMobile = window.matchMedia("(max-width: 1024px)").matches;

      gsap.set([menuOverlay, menuOverlayContainer, menuBackdrop], {
        willChange: "transform, clip-path, opacity",
      });

      setBackdropFilterCss(
        menuBackdrop,
        isMobile ? "blur(4px)" : "blur(6px)",
      );

      tl.to(menuBackdrop, {
        background: isMobile
          ? "rgba(var(--base-rgb), 0.6)"
          : "rgba(var(--base-rgb), 0.7)",
        duration: 0.35,
        ease: "power2.out",
      })
        .to(
          menuOverlay,
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 0.6,
            ease: "power3.inOut",
          },
          "<",
        )
        .to(
          menuOverlayContainer,
          {
            yPercent: 0,
            duration: 0.6,
            ease: "power3.inOut",
          },
          "<",
        );

      const phase2 = 0.5;

      if (menuMediaWrapper) {
        tl.to(
          menuMediaWrapper,
          {
            scale: 1,
            duration: 0.45,
            ease: "power2.out",
          },
          phase2,
        );
      }

      tl.to(
        mainTargets,
        { yPercent: 0, stagger: 0.06, ease: "power3.out", duration: 0.5 },
        phase2,
      )
        .to(
          menuDividers,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            stagger: 0.06,
            ease: "power2.out",
            duration: 0.5,
          },
          phase2,
        )
        .to(
          menuArrows,
          { opacity: 1, stagger: 0.06, ease: "power2.out", duration: 0.4 },
          phase2 + 0.1,
        )
        .to(
          headerTargets,
          { yPercent: 0, stagger: 0.04, ease: "power3.out", duration: 0.45 },
          phase2 + 0.05,
        )
        .to(
          contactRevealTargets,
          { yPercent: 0, stagger: 0.04, ease: "power3.out", duration: 0.45 },
          phase2 + 0.15,
        )
        .to(
          footerTargets,
          { yPercent: 0, stagger: 0.04, ease: "power3.out", duration: 0.45 },
          phase2 + 0.2,
        );

      isMenuOpen = true;
    } else {
      closeMenuAnimated();
    }
  };

  const findMenuRowByToggle = (
    t: HTMLDivElement,
  ): MxdMenuGsapMenuRow | undefined => menuRows.find((row) => row.toggle === t);

  const onAccordionClick = (e: MouseEvent) => {
    const target = e.target instanceof Element ? e.target : null;
    if (!target) return;

    for (const row of menuRows) {
      if (
        row.submenu &&
        row.submenu.contains(target) &&
        !row.toggle.contains(target)
      ) {
        return;
      }
    }

    const toggleEl = menuRows
      .map((r) => r.toggle)
      .find((t) => t.contains(target));
    if (!toggleEl) return;

    const row = findMenuRowByToggle(toggleEl);
    if (!row || !row.submenu) return;

    e.preventDefault();
    e.stopPropagation();

    const { item, submenu } = row;
    const wasOpen = item.classList.contains("open");

    menuRows.forEach((other) => {
      if (other === row || !other.submenu) return;
      if (other.item.classList.contains("open")) {
        animateSubmenuClose(other.submenu, other.item);
      }
    });

    if (wasOpen) {
      animateSubmenuClose(submenu, item);
    } else {
      animateSubmenuOpen(submenu, item);
    }
  };

  /**
   * Instant reset on in-menu navigation. `closeMenuAnimated` races Next.js:
   * the route commits while tweens still run → React removeChild errors.
   * Capture runs before target/bubble so GSAP is cleared before Link handles the click.
   */
  const onNavLinkCapture = (e: MouseEvent) => {
    const target = e.target instanceof Element ? e.target : null;
    const anchor = target?.closest("a[href]");
    if (!anchor || !nav.contains(anchor)) return;
    const href = anchor.getAttribute("href");
    if (!href || href === "#0" || href.startsWith("#")) return;
    resetMenu();
  };

  toggle.addEventListener("click", onToggleClick);
  nav.addEventListener("click", onNavLinkCapture, true);
  nav.addEventListener("click", onAccordionClick, true);

  const dispose = () => {
    toggle.removeEventListener("click", onToggleClick);
    nav.removeEventListener("click", onNavLinkCapture, true);
    nav.removeEventListener("click", onAccordionClick, true);
    killTimeline();
    resetSubmenus(menuRows);
    gsap.killTweensOf([
      ...allTextTargets,
      ...contactRevealTargets,
      ...menuDividers,
      ...menuArrows,
      menuOverlay,
      menuOverlayContainer,
      menuBackdrop,
      menuMediaWrapper,
    ].filter(Boolean));
    menuBackdrop.style.removeProperty("backdrop-filter");
    menuBackdrop.style.removeProperty("-webkit-backdrop-filter");
    gsap.set(allTextTargets, { clearProps: "transform,overflow,display,willChange" });
    gsap.set(contactRevealTargets, {
      clearProps: "transform,display,willChange",
    });
    lenis?.start();
  };

  return { resetMenu, closeMenuAnimated, dispose };
}
