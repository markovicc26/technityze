"use client";

/* eslint-disable react-hooks/refs -- RefObjects passed to `ref={}`; slotters only touch refs in callbacks */
import type { MutableRefObject } from "react";
import { useMemo } from "react";
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
  // Drop hash fragments so /#works still matches /.
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

  const parentItemClass = (current: boolean) =>
    `main-menu__item${current ? " main-menu__item--current" : ""}`;

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
  const submenuSlots = useMemo(() => makeSlotters(g.menuSubmenus, 5), [g]);

  useMxdMenuGsap(navNode, toggleNode, hamburgerNode, registerMenuReset, g);

  return (
    <nav className="mxd-menu mxd-menu--gsap" ref={setNavNode}>
      <div ref={g.backdrop} className="mxd-menu__backdrop" />
      {/* Menu Overlay Start */}
      <div ref={g.overlay} className="mxd-menu__overlay">
        <div
          ref={g.content}
          className="mxd-menu__content"
          data-lenis-prevent=""
        >
          {/* Menu Logo Start */}
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
          {/* Menu Logo End */}
          {/* Menu Media Start */}
          <div className="mxd-menu__media">
            <div ref={g.mediaWrapper} className="menu-media__wrapper">
              {/* <Image   alt="Image"    src="/img/gifs/dolores.gif" width="322" height="374" /> */}
              <AutoplayLoopVideo
                poster="video/900x1280_menu.webp"
                sources={[
                  { type: "video/mp4", src: "video/900x1280_menu.mp4" },
                  { type: "video/webm", src: "video/900x1280_menu.webm" },
                ]}
              />
            </div>
          </div>
          {/* Menu Media End */}
          {/* Main Navigation Start */}
          <div className="mxd-menu__navigation">
            <div className="mxd-menu__inner">
              <div className="mxd-menu__shadow shadow-top" />
              <div className="mxd-menu__caption">
                <p ref={headerSlots[2]} className="t-hidden">
                  &nbsp;
                </p>
              </div>
              {/* left side */}
              <div className="mxd-menu__left">
                <div className="main-menu">
                  <div className="main-menu__content">
                    <ul id="main-menu" className="main-menu__accordion main-menu--flat">
                      {FLAT_NAV.map((item, idx) => (
                        <li
                          key={item.href}
                          ref={liSlots[idx]}
                          className={parentItemClass(
                            pathMatches(pathname, item.href) ||
                              (item.match
                                ? sectionHasActiveRoute(pathname, item.match)
                                : false)
                          )}
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
                            <Link
                              className="main-menu__link"
                              href={item.href}
                            >
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
                      {/* Hidden arrow refs the GSAP collector expects (4
                          slots from the legacy accordion layout). We do NOT
                          assign submenu refs here - leaving them null tells
                          the click handler `row.submenu` is null, so the
                          accordion controller stays out of the way and the
                          Link inside the toggle is allowed to navigate. */}
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
              {/* right side */}
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
              {/* data bottom line */}
              <div className="mxd-menu__shadow" />
              <div className="mxd-menu__data">
                <div className="menu-data__left">
                  <p ref={footerSlots[0]} className="menu-data__text">
                    <span ref={footerSlots[1]} className="t-hidden" />
                  </p>
                </div>
                <div className="menu-data__right">
                  <p ref={footerSlots[2]} className="menu-data__text">
                    Copyright Technityze
                  </p>
                  <p ref={footerSlots[3]} className="menu-data__text">
                    ©{new Date().getFullYear()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Main Navigation End */}
        </div>
      </div>
      {/* Menu Overlay End */}
    </nav>
  );
}
