"use client";

import { useEffect, useState } from "react";
import ThemeSwitcher from "@/components/headers/ThemeSwitcher";

/** Reads the current `color-scheme` attribute on <html> at mount so the
 *  toggle in the menu overlay starts in sync with the header toggle.
 *  Clicking either keeps both in sync because they both write to the
 *  same attribute via `applyTheme`. */
export default function MenuThemeSwitcher() {
  const [initial, setInitial] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute("color-scheme");
    setInitial(current === "light" ? "light" : "dark");
  }, []);

  if (!initial) return null;
  return (
    <span className="technityze-menu-theme">
      <ThemeSwitcher initialTheme={initial} />
    </span>
  );
}
