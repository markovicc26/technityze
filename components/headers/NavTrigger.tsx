"use client";

import { useEffect, useState } from "react";
import CommonLoadAnimation, {
  CommonLoadFade,
} from "@/components/animations/CommonLoadAnimation";
import ThemeSwitcher from "@/components/headers/ThemeSwitcher";

type NavTriggerProps = {
  setToggleNode: (el: HTMLDivElement | null) => void;
  setHamburgerNode: (el: HTMLElement | null) => void;
};

export default function NavTrigger({
  setToggleNode,
  setHamburgerNode,
}: NavTriggerProps) {
  // Read the current color-scheme from <html> on mount so the switcher
  // here renders in sync with whatever the header switcher already set.
  const [initialTheme, setInitialTheme] = useState<"light" | "dark" | null>(
    null,
  );
  useEffect(() => {
    const t = document.documentElement.getAttribute("color-scheme");
    setInitialTheme(t === "light" ? "light" : "dark");
  }, []);

  return (
    <CommonLoadAnimation>
      <CommonLoadFade index={0}>
        <div className="mxd-menu__contain loading-fade">
          {initialTheme ? (
            <span className="technityze-sticky-theme">
              <ThemeSwitcher initialTheme={initialTheme} />
            </span>
          ) : null}
          <div className="mxd-menu__toggle" ref={setToggleNode}>
            <a
              href="#0"
              className="mxd-menu__hamburger"
              aria-label="Menu"
              ref={setHamburgerNode}
            >
              <div className="hamburger__line" />
              <div className="hamburger__line" />
            </a>
          </div>
        </div>
      </CommonLoadFade>
    </CommonLoadAnimation>
  );
}
