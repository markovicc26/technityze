"use client";

import { initVelocityMarqueeRows } from "@/lib/template/stackCardsEffects";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import CommonLoadAnimation, {
  CommonLoadFade,
} from "@/components/animations/CommonLoadAnimation";
import CommonAnimatedText from "@/components/animations/CommonAnimatedText";
import TextScramble from "@/components/animations/TextScramble";

const MARQUEE_PHRASES = [
  "404/",
  "Wrong URL/",
  "Dead link/",
  "Nothing here/",
  "Try /work/",
];

function MarqueeRow({
  rowRef,
  variant,
}: {
  rowRef: (el: HTMLDivElement | null) => void;
  variant: "top" | "bottom";
}) {
  return (
    <div className={`marquee__${variant}`} ref={rowRef}>
      {MARQUEE_PHRASES.map((phrase, i) => (
        <div
          key={`${variant}-${i}-${phrase}`}
          className="marquee__item item-regular text"
        >
          <p className="marquee__text text-with-gliph">{phrase}</p>
        </div>
      ))}
    </div>
  );
}

export default function NotFound() {
  const topRefs = useRef<HTMLDivElement[]>([]);
  const bottomRefs = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    return initVelocityMarqueeRows(topRefs.current, bottomRefs.current);
  }, []);

  return (
    <CommonLoadAnimation>
      <>
        <div className="mxd-section mxd-section-fullscreen loading-wrap">
          <div className="mxd-error">
            <div className="mxd-error__background">
              <div className="card__marquees">
                <div className="marquee marquee-stack marquee--gsap muted-extra">
                  <MarqueeRow
                    rowRef={(el) => {
                      if (el) topRefs.current[0] = el;
                    }}
                    variant="top"
                  />
                  <MarqueeRow
                    rowRef={(el) => {
                      if (el) bottomRefs.current[0] = el;
                    }}
                    variant="bottom"
                  />
                  <MarqueeRow
                    rowRef={(el) => {
                      if (el) topRefs.current[1] = el;
                    }}
                    variant="top"
                  />
                  <MarqueeRow
                    rowRef={(el) => {
                      if (el) bottomRefs.current[1] = el;
                    }}
                    variant="bottom"
                  />
                </div>
              </div>
            </div>

            <div className="mxd-container fullscreen-container">
              <div className="mxd-block mxd-block-fullscreen centered-content">
                <div className="mxd-error__content">
                  <div className="mxd-error__number technityze-404-number">
                    <span>4</span>
                    <CommonLoadFade index={0}>
                      <span
                        className="technityze-logo-mask technityze-404-octopus loading-fade"
                        role="img"
                        aria-label="Technityze octopus mascot"
                      />
                    </CommonLoadFade>
                    <span>4</span>
                  </div>
                  <div className="mxd-error__caption">
                    <CommonAnimatedText
                      as="p"
                      className="loading-split"
                      animation="splitLinesLoad"
                    >
                      This page doesn&apos;t exist.{" "}
                      <span>Could be a typo, could be on us.</span>
                    </CommonAnimatedText>
                    <CommonLoadFade index={1}>
                      <Link
                        className="btn btn-default-icon btn-default-icon-left btn-default-outline slide-left loading-fade"
                        href={`/`}
                      >
                        <i className="btn-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            version="1.1"
                            viewBox="0 0 18 18"
                          >
                            <path d="M7.2,18v-3.6h3.6v3.6h-3.6ZM3.6,7.2H0v3.6h3.6v3.6h3.6v-3.6h10.8v-3.6H7.2v-3.6h-3.6s0,3.6,0,3.6ZM7.2,3.6h3.6V0h-3.6v3.6Z" />
                          </svg>
                        </i>
                        <TextScramble className="btn-caption mxd-scramble">
                          Back home
                        </TextScramble>
                      </Link>
                    </CommonLoadFade>
                  </div>
                </div>

                <CommonLoadFade index={2}>
                  <div className="mxd-error__dataline loading-fade">
                    <div className="mxd-error__dataitem">
                      <span className="tag tag-m">
                        <TextScramble className="mxd-scramble">
                          Technityze
                        </TextScramble>
                        . Two builders, one studio.
                      </span>
                    </div>
                    <div className="mxd-error__dataitem">
                      <a
                        className="tag tag-m"
                        href="mailto:contact@technityze.com?subject=Broken%20link"
                      >
                        <TextScramble className="mxd-scramble">
                          contact@technityze.com
                        </TextScramble>
                      </a>
                    </div>
                    <div className="mxd-error__dataitem">
                      <span className="tag tag-m">
                        ©{new Date().getFullYear()}
                      </span>
                    </div>
                  </div>
                </CommonLoadFade>
              </div>
            </div>
          </div>
        </div>
      </>
    </CommonLoadAnimation>
  );
}
