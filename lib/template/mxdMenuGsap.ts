"use client";

import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText.js";
import type Lenis from "lenis";

gsap.registerPlugin(SplitText);

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

function splitAndHide(elements: HTMLElement[]): SplitText[] {
  if (!elements.length) return [];
  return elements.map((el) => {
    const split = SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "line",
      aria: "none",
    });
    gsap.set(split.lines, { y: "-114%" });
    return split;
  });
}

function flatLines(splits: SplitText[]): HTMLElement[] {
  return splits.flatMap((s) => s.lines);
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

  const headerSplits = splitAndHide(headerSplitElements);
  const mainMenuSplits = splitAndHide(mainMenuLinkSpans);
  const footerSplits = splitAndHide(footerSplitElements);
  // Match legacy SplitText line-mask feel for contact column.
  gsap.set(contactAnchors, { display: "block", overflow: "hidden" });
  gsap.set(contactRevealTargets, { display: "inline-block", y: "-114%" });

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
    backdropFilter: "blur(0px)",
  });
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
    gsap.set(menuOverlay, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    });
    gsap.set(menuBackdrop, {
      background: "rgba(var(--base-rgb), 0)",
      backdropFilter: "blur(0px)",
    });
    gsap.set(menuOverlayContainer, { yPercent: -50 });
    if (menuMediaWrapper) {
      gsap.set(menuMediaWrapper, { scale: 1.4 });
    }

    flatLines([
      ...headerSplits,
      ...mainMenuSplits,
      ...footerSplits,
    ]).forEach((line) => gsap.set(line, { y: "-114%" }));
    gsap.set(contactRevealTargets, { display: "inline-block", y: "-114%" });
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
          // Animate only opacity-equivalent (background alpha). The
          // backdrop-filter value itself is removed in the final .call()
          // so we never re-rasterize a varying blur radius.
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
        // Drop the backdrop-filter in one shot at the end, plus release
        // will-change so the compositor can recycle the GPU tiles.
        gsap.set(menuBackdrop, {
          backdropFilter: "blur(0px)",
          webkitBackdropFilter: "blur(0px)",
        });
        gsap.set([menuOverlay, menuOverlayContainer, menuBackdrop], {
          willChange: "auto",
        });
        flatLines([
          ...headerSplits,
          ...mainMenuSplits,
          ...footerSplits,
        ]).forEach((line) => gsap.set(line, { y: "-114%" }));
        gsap.set(contactRevealTargets, { display: "inline-block", y: "-114%" });
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

      // Promote layers to the compositor before the animation starts -
      // avoids the first-frame stutter while the browser allocates GPU
      // tiles for the elements that are about to move/clip/blur.
      gsap.set([menuOverlay, menuOverlayContainer, menuBackdrop], {
        willChange: "transform, clip-path, opacity",
      });

      // Apply the (expensive) backdrop-filter blur *instantly* on the
      // first frame instead of animating its radius. Animating the blur
      // pixel radius re-rasterizes the page underneath every frame and
      // is the main cause of choppy menu opens.
      gsap.set(menuBackdrop, {
        backdropFilter: isMobile ? "blur(4px)" : "blur(6px)",
        webkitBackdropFilter: isMobile ? "blur(4px)" : "blur(6px)",
      });

      // Phase 1: overlay snap. clipPath + transform run alone so the GPU
      // isn't fighting 30 simultaneous split-line animations during the
      // heaviest paint. Slightly longer duration than the snap-mode
      // version feels more natural to the eye.
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

      // Phase 2: once the overlay is in place, run the content reveal. */
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
        mainMenuSplits.flatMap((s) => s.lines),
        { y: "0%", stagger: 0.06, ease: "power3.out", duration: 0.5 },
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
          headerSplits.flatMap((s) => s.lines),
          { y: "0%", stagger: 0.04, ease: "power3.out", duration: 0.45 },
          phase2 + 0.05,
        )
        .to(
          contactRevealTargets,
          { y: "0%", stagger: 0.04, ease: "power3.out", duration: 0.45 },
          phase2 + 0.15,
        )
        .to(
          footerSplits.flatMap((s) => s.lines),
          { y: "0%", stagger: 0.04, ease: "power3.out", duration: 0.45 },
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

  const onNavLinkClick = (e: MouseEvent) => {
    const target = e.target instanceof Element ? e.target : null;
    const anchor = target?.closest("a[href]");
    if (!anchor || !nav.contains(anchor)) return;
    const href = anchor.getAttribute("href");
    if (!href || href === "#0" || href.startsWith("#")) return;
    closeMenuAnimated();
  };

  toggle.addEventListener("click", onToggleClick);
  nav.addEventListener("click", onAccordionClick, true);
  nav.addEventListener("click", onNavLinkClick);

  const dispose = () => {
    toggle.removeEventListener("click", onToggleClick);
    nav.removeEventListener("click", onAccordionClick, true);
    nav.removeEventListener("click", onNavLinkClick);
    killTimeline();
    resetSubmenus(menuRows);
    [
      ...headerSplits,
      ...mainMenuSplits,
      ...footerSplits,
    ].forEach((s) => s.revert());
    lenis?.start();
  };

  return { resetMenu, closeMenuAnimated, dispose };
}
