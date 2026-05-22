"use client";

import Link from "next/link";
import { useLayoutEffect } from "react";
import { useBlurContainerRef } from "@/components/animations/BlurScrollRoot";
import AutoplayLoopVideo from "@/components/media/AutoplayLoopVideo";
import PinnedSection from "@/components/animations/PinnedSection";
import CommonLoadAnimation, {
  CommonLoadFade,
  CommonLoadItem,
} from "@/components/animations/CommonLoadAnimation";
import CommonAnimatedText from "@/components/animations/CommonAnimatedText";
import TextScramble from "@/components/animations/TextScramble";

const TAGS_LEFT = ["WordPress", "Webflow", "Shopify", "Next.js", "React Native"];
const TAGS_RIGHT = ["Web apps", "Mobile apps", "E-commerce", "Dashboards", "SEO"];

export default function Hero() {
  // Keep the global Technityze blur container forced visible while the hero
  // is anywhere in the viewport. The WhoIsItFor BlurSection (and others)
  // fire onLeaveBack/onLeave at the wrong moments and try to set
  // display:none - which would flicker. A MutationObserver on the
  // container's style attribute reverts any such write back to "block"
  // synchronously, before the next paint, so there is no visible flicker.
  // HideGlobalBlur near the footer toggles a flag that lets `none`
  // through once we are at the bottom of the page.
  const blurContainerRef = useBlurContainerRef();
  useLayoutEffect(() => {
    const hero = document.querySelector<HTMLElement>(".technityze-hero");
    const container = blurContainerRef.current;
    if (!hero || !container) return;

    let allowHide = false;
    container.style.display = "block";

    const isHeroInView = () => {
      const r = hero.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    };

    const mo = new MutationObserver(() => {
      if (
        !allowHide &&
        isHeroInView() &&
        container.style.display !== "block"
      ) {
        container.style.display = "block";
      }
    });
    mo.observe(container, { attributes: true, attributeFilter: ["style"] });

    // Expose toggle for HideGlobalBlur (footer marker) to use.
    (window as unknown as { __technityzeAllowBlurHide?: (v: boolean) => void }).
      __technityzeAllowBlurHide = (v: boolean) => {
      allowHide = v;
      if (v) container.style.display = "none";
    };

    return () => {
      mo.disconnect();
      delete (
        window as unknown as { __technityzeAllowBlurHide?: unknown }
      ).__technityzeAllowBlurHide;
    };
  }, [blurContainerRef]);

  return (
    <CommonLoadAnimation>
      <>
        <PinnedSection className="mxd-section mxd-hero-section no-padding mxd-hero-fullheight loading-wrap technityze-hero">
          <PinnedSection.Inner>
            <div className="mxd-hero-06">
              <div className="mxd-hero-06__media">
                <AutoplayLoopVideo
                  id="mxd-hero-06__video"
                  className="mxd-hero-06__video"
                  poster="video/1280x720_hero-06.webp"
                  sources={[
                    { type: "video/mp4", src: "video/1280x720_hero-06.mp4" },
                    { type: "video/webm", src: "video/1280x720_hero-06.webm" },
                  ]}
                  data-poster-landscape="video/1280x720_hero-06.webp"
                  data-poster-portrait="video/720x1280_hero-06.webp"
                  data-landscape-mp4="video/1280x720_hero-06.mp4"
                  data-landscape-webm="video/1280x720_hero-06.webm"
                  data-portrait-mp4="video/720x1280_hero-06.mp4"
                  data-portrait-webm="video/720x1280_hero-06.webm"
                />
                <div className="technityze-hero-blur" aria-hidden />
              </div>
              <div className="mxd-hero-06__wrap">
                {/* top - tags */}
                <div className="mxd-hero-06__top">
                  <div className="mxd-hero-06__tags">
                    <div className="tags-column">
                      <ul>
                        {TAGS_LEFT.map((tag, i) => (
                          <CommonLoadItem index={i} key={tag}>
                            <li className="loading-item">
                              <TextScramble className="tag tag-s-mobile tag-permanent-medium mxd-scramble">
                                {tag}
                              </TextScramble>
                            </li>
                          </CommonLoadItem>
                        ))}
                      </ul>
                    </div>
                    <div className="tags-column">
                      <ul>
                        {TAGS_RIGHT.map((tag, i) => (
                          <CommonLoadItem index={5 + i} key={tag}>
                            <li className="loading-item">
                              <TextScramble className="tag tag-s-mobile tag-permanent-medium mxd-scramble">
                                {tag}
                              </TextScramble>
                            </li>
                          </CommonLoadItem>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* mid-right headline + CTA */}
                <div className="technityze-hero-headline">
                  <CommonAnimatedText
                    as="h2"
                    className="loading-split"
                    animation="splitLinesLoad"
                  >
                    We build premium digital products for businesses that take operations
                    <br />
                    <span>seriously.</span>
                  </CommonAnimatedText>
                  <CommonLoadFade index={2}>
                    <div className="technityze-hero-cta loading-fade">
                      <Link
                        href="/contact"
                        className="btn btn-default-icon btn-default-accent slide-right anim-uni-in-up technityze-hero-cta__btn"
                        data-cursor-text="Let's Chat"
                      >
                        <span className="btn-caption mxd-scramble">
                          Let&apos;s build it
                        </span>
                        <i className="btn-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            version="1.1"
                            viewBox="0 0 18 18"
                          >
                            <path d="M10.8,0v3.6h-3.6V0h3.6ZM14.4,10.8h3.6v-3.6h-3.6v-3.6h-3.6v3.6H0v3.6h10.8v3.6h3.6v-3.6ZM10.8,14.4h-3.6v3.6h3.6v-3.6Z" />
                          </svg>
                        </i>
                      </Link>
                    </div>
                  </CommonLoadFade>
                </div>

                {/* bottom - fullwidth brand name */}
                <div className="mxd-hero-06__bottom technityze-hero-bottom">
                  <div className="fullwidth-text">
                    <div className="fullwidth-text__wrap">
                      <Link
                        className="fullwidth-text__content permanent active-cursor-accent"
                        data-cursor-text="Let's Chat"
                        href="/contact"
                      >
                        <CommonAnimatedText
                          as="span"
                          className="loading-chars"
                          animation="animCharsLoad"
                        >
                          technityze
                        </CommonAnimatedText>
                      </Link>
                    </div>
                  </div>
                  <CommonLoadFade index={0}>
                    <div className="loading-fade" />
                  </CommonLoadFade>
                </div>
              </div>
            </div>
          </PinnedSection.Inner>
          <PinnedSection.Trigger />
        </PinnedSection>
      </>
    </CommonLoadAnimation>
  );
}
