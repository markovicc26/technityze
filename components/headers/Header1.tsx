"use client";

import Link from "next/link";
import { useRef } from "react";
import TextScramble from "@/components/animations/TextScramble";
import { useLenis } from "@/components/common/LenisContext";
import { useHeaderScrollHidden } from "@/hooks/useHeaderScrollHidden";
import CommonLoadAnimation, {
  CommonLoadFade,
} from "@/components/animations/CommonLoadAnimation";
import { usePathname } from "next/navigation";

type Header1Props = {
  initialTheme: "light" | "dark";
};

export default function Header1(_props: Header1Props) {
  const headerRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  useHeaderScrollHidden(headerRef, lenis);
  const pathname = usePathname();
  const isPermanent = pathname === "/services";
  return (
    <CommonLoadAnimation>
      <header
        id="header"
        ref={headerRef}
        className={`mxd-header ${isPermanent ? "mxd-header-permanent" : ""}`}
      >
        <CommonLoadFade index={0}>
          <div className="mxd-header__logo loading-fade">
            <Link className="mxd-logo" href={`/`}>
              <span
                className="mxd-logo__image technityze-logo-mask"
                role="img"
                aria-label="Technityze octopus logo"
              />
              <div className="mxd-logo__text">
                <TextScramble className="mxd-scramble">Technityze</TextScramble>
              </div>
            </Link>
          </div>
        </CommonLoadFade>
        {/* ThemeSwitcher now lives in NavTrigger (sticky beside hamburger). */}
      </header>
    </CommonLoadAnimation>
  );
}
