"use client";

/* eslint-disable react-hooks/refs -- RefObjects passed to `ref={}`; slotters only touch refs in callbacks */
import type { MutableRefObject, RefObject } from "react";
import { memo, useLayoutEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AutoplayLoopVideo from "@/components/media/AutoplayLoopVideo";
import { useMxdMenuGsap, useMxdMenuGsapRefs } from "@/hooks/useMxdMenuGsap";
import TextScramble from "@/components/animations/TextScramble";

/* Flat top-level nav. Five direct links, no accordion / submenus. */
type FlatNavItem = {
  href: string;
  label: string;
  /** Additional routes that should count as "current" for this item. */
  match?: { href: string }[];
};

const FLAT_NAV: FlatNavItem[] = [
  { href: "/", label: "Home" },
  { href: "/#works", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about-us", label: "About" },
  { href: "/contact", label: "Contact" },
];

function normalizePath(p: string): string {
  if (!p) return "/";
  const noHash = p.split("#")[0] ?? "/";
  const t = noHash.endsWith("/") && noHash.length > 1 ? noHash.slice(0, -1) : noHash;
  return t || "/";
}

function pathMatches(pathname: string, href: string): boolean {
  return normalizePath(pathname) === normalizePath(href);
}

function sectionHasActiveRoute(
  pathname: string,
  links: { href: string }[],
): boolean {
  return links.some((l) => pathMatches(pathname, l.href));
}

function makeSlotters<T>(
  arr: MutableRefObject<(T | null)[]>,
  len: number,
): ((el: T | null) => void)[] {
  return Array.from({ length: len }, (_, i) => (el: T | null) => {
    arr.current[i] = el;
  });
}

type SlotPack = {
  headerSlots: ((el: HTMLElement | null) => void)[];
  mainSlots: ((el: HTMLElement | null) => void)[];
  contactSlots: ((el: HTMLElement | null) => void)[];
  contactRevealSlots: ((el: HTMLElement | null) => void)[];
  footerSlots: ((el: HTMLElement | null) => void)[];
  dividerSlots: ((el: HTMLDivElement | null) => void)[];
  arrowSlots: ((el: HTMLSpanElement | null) => void)[];
  liSlots: ((el: HTMLLIElement | null) => void)[];
  toggleSlots: ((el: HTMLDivElement | null) => void)[];
};

type NavMenuFrozenProps = SlotPack & {
  setNavNode: (el: HTMLElement | null) => void;
  backdrop: RefObject<HTMLDivElement | null>;
  overlay: RefObject<HTMLDivElement | null>;
  content: RefObject<HTMLDivElement | null>;
  mediaWrapper: RefObject<HTMLDivElement | null>;
};

/**
 * Renders once and never re-renders (`arePropsEqual` always true).
 * Route changes must NOT reconcile this tree: GSAP owns transforms on descendants.
 * Active nav item is updated imperatively in `Nav` via `classList`.
 */
const NavMenuFrozen = memo(function NavMenuFrozen({
  setNavNode,
  backdrop,
  overlay,
  content,
  mediaWrapper,
  headerSlots,
  mainSlots,
  contactSlots,
  contactRevealSlots,
  footerSlots,
  dividerSlots,
  arrowSlots,
  liSlots,
  toggleSlots,
}: NavMenuFrozenProps) {
  const year = new Date().getFullYear();
  return (
    <nav className="mxd-menu mxd-menu--gsap" ref={setNavNode}>
      <div ref={backdrop} className="mxd-menu__backdrop" />
      <div ref={overlay} className="mxd-menu__overlay">
        <div
          ref={content}
          className="mxd-menu__content"
          data-lenis-prevent=""
        >
          <div className="mxd-menu__logo technityze-menu-logo">
            <Link href={`/`} className="menu-logo">
              <span
                className="menu-logo__image technityze-logo-mask technityze-menu-logo__image"
                role="img"
                aria-label="Technityze octopus logo"
              />
              <div className="menu-logo__text technityze-menu-logo__text">
                <span ref={headerSlots[0]}>
                  Technityze
                  <em ref={headerSlots[1]} className="technityze-menu-logo__sub">
                    (built by 2)
                  </em>
                </span>
              </div>
            </Link>
          </div>
          <div className="mxd-menu__media">
            <div ref={mediaWrapper} className="menu-media__wrapper">
              <AutoplayLoopVideo
                poster="video/900x1280_menu.webp"
                sources={[
                  { type: "video/mp4", src: "video/900x1280_menu.mp4" },
                  { type: "video/webm", src: "video/900x1280_menu.webm" },
                ]}
              />
            </div>
          </div>
          <div className="mxd-menu__navigation">
            <div className="mxd-menu__inner">
              <div className="mxd-menu__shadow shadow-top" />
              <div className="mxd-menu__caption">
                <p ref={headerSlots[2]} className="t-hidden">
                  &nbsp;
                </p>
              </div>
              <div className="mxd-menu__left">
                <div className="main-menu">
                  <div className="main-menu__content">
                    <ul id="main-menu" className="main-menu__accordion main-menu--flat">
                      {FLAT_NAV.map((item, idx) => (
                        <li
                          key={item.href}
                          ref={liSlots[idx]}
                          className="main-menu__item"
                        >
                          {idx === 0 ? (
                            <div
                              ref={dividerSlots[0]}
                              className="main-menu__divider divider-top"
                            />
                          ) : null}
                          <div
                            ref={toggleSlots[idx]}
                            className="main-menu__toggle"
                          >
                            <Link className="main-menu__link" href={item.href}>
                              <span
                                ref={mainSlots[idx * 2]}
                                className="main-menu__number"
                              >
                                / {String(idx + 1).padStart(2, "0")}
                              </span>
                              <span
                                ref={mainSlots[idx * 2 + 1]}
                                className="main-menu__caption"
                              >
                                {item.label}
                              </span>
                            </Link>
                          </div>
                          <div
                            ref={dividerSlots[idx + 1]}
                            className="main-menu__divider divider-bottom"
                          />
                        </li>
                      ))}
                      <li className="t-hidden" aria-hidden>
                        <span ref={arrowSlots[0]} />
                        <span ref={arrowSlots[1]} />
                        <span ref={arrowSlots[2]} />
                        <span ref={arrowSlots[3]} />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mxd-menu__right">
                <div className="menu-contact">
                  <div className="menu-contact__item">
                    <ul className="menu-contact__list">
                      <li>
                        <a
                          ref={contactSlots[0]}
                          className="tag tag-m"
                          href="mailto:contact@technityze.com?subject=Project%20inquiry"
                        >
                          <TextScramble
                            ref={contactRevealSlots[0]}
                            className="mxd-scramble"
                          >
                            contact@technityze.com
                          </TextScramble>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="menu-contact__item">
                    <ul className="menu-contact__list">
                      <li>
                        <a
                          ref={contactSlots[1]}
                          className="tag tag-m"
                          href="https://maps.google.com/?q=Belgrade,+Serbia"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span ref={contactRevealSlots[1]}>
                            Belgrade, Serbia
                            <br />
                            Remote across EU
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="menu-contact__item">
                    <ul className="menu-contact__list">
                      <li>
                        <a
                          ref={contactSlots[2]}
                          className="tag tag-m"
                          href="https://github.com/markovicc26"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <TextScramble
                            ref={contactRevealSlots[2]}
                            className="mxd-scramble"
                          >
                            Github
                          </TextScramble>
                        </a>
                      </li>
                      <li>
                        <a
                          ref={contactSlots[3]}
                          className="tag tag-m"
                          href="https://www.linkedin.com/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <TextScramble
                            ref={contactRevealSlots[3]}
                            className="mxd-scramble"
                          >
                            LinkedIn
                          </TextScramble>
                        </a>
                      </li>
                      <li>
                        <a
                          ref={contactSlots[4]}
                          className="tag tag-m"
                          href="https://www.instagram.com/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <TextScramble
                            ref={contactRevealSlots[4]}
                            className="mxd-scramble"
                          >
                            Instagram
                          </TextScramble>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mxd-menu__shadow" />
              <div className="mxd-menu__data">
                <div className="menu-data__left">
                  <p className="menu-data__text t-hidden">
                    <span ref={footerSlots[0]}>&nbsp;</span>
                  </p>
                  <p className="menu-data__text t-hidden">
                    <span ref={footerSlots[1]}>&nbsp;</span>
                  </p>
                </div>
                <div className="menu-data__right">
                  <p ref={footerSlots[2]} className="menu-data__text">
                    Copyright Technityze
                  </p>
                  <p ref={footerSlots[3]} className="menu-data__text">
                    ©{year}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}, () => true);

type NavProps = {
  navNode: HTMLElement | null;
  toggleNode: HTMLElement | null;
  hamburgerNode: HTMLElement | null;
  setNavNode: (el: HTMLElement | null) => void;
  registerMenuReset: (fn: (() => void) | null) => void;
};

export default function Nav({
  navNode,
  toggleNode,
  hamburgerNode,
  setNavNode,
  registerMenuReset,
}: NavProps) {
  const pathname = usePathname();
  const g = useMxdMenuGsapRefs();

  const headerSlots = useMemo(() => makeSlotters(g.headerSplitTargets, 3), [g]);
  const mainSlots = useMemo(() => makeSlotters(g.mainMenuLinkSpans, 10), [g]);
  const contactSlots = useMemo(() => makeSlotters(g.contactAnchors, 5), [g]);
  const contactRevealSlots = useMemo(
    () => makeSlotters(g.contactRevealTargets, 5),
    [g],
  );
  const footerSlots = useMemo(() => makeSlotters(g.footerSplitTargets, 4), [g]);
  const dividerSlots = useMemo(() => makeSlotters(g.dividers, 6), [g]);
  const arrowSlots = useMemo(() => makeSlotters(g.arrows, 4), [g]);
  const liSlots = useMemo(() => makeSlotters(g.menuItemLis, 5), [g]);
  const toggleSlots = useMemo(() => makeSlotters(g.menuToggles, 5), [g]);

  useMxdMenuGsap(navNode, toggleNode, hamburgerNode, registerMenuReset, g);

  useLayoutEffect(() => {
    for (let idx = 0; idx < FLAT_NAV.length; idx++) {
      const li = g.menuItemLis.current[idx];
      if (!li) continue;
      const item = FLAT_NAV[idx]!;
      const current =
        pathMatches(pathname, item.href) ||
        (item.match ? sectionHasActiveRoute(pathname, item.match) : false);
      li.classList.toggle("main-menu__item--current", current);
    }
  }, [pathname, g]);

  const frozenProps = useMemo<NavMenuFrozenProps>(
    () => ({
      setNavNode,
      backdrop: g.backdrop,
      overlay: g.overlay,
      content: g.content,
      mediaWrapper: g.mediaWrapper,
      headerSlots,
      mainSlots,
      contactSlots,
      contactRevealSlots,
      footerSlots,
      dividerSlots,
      arrowSlots,
      liSlots,
      toggleSlots,
    }),
    [
      setNavNode,
      g.backdrop,
      g.overlay,
      g.content,
      g.mediaWrapper,
      headerSlots,
      mainSlots,
      contactSlots,
      contactRevealSlots,
      footerSlots,
      dividerSlots,
      arrowSlots,
      liSlots,
      toggleSlots,
    ],
  );

  return <NavMenuFrozen {...frozenProps} />;
}
