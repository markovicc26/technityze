"use client";

import BlurSection from "@/components/animations/BlurSection";
import Link from "next/link";
import CommonAnimatedText from "@/components/animations/CommonAnimatedText";
import CommonLoadAnimation, {
  CommonLoadFade,
} from "@/components/animations/CommonLoadAnimation";
import TextScramble from "@/components/animations/TextScramble";

export default function InnerHeadline() {
  return (
    <CommonLoadAnimation>
      <>
        <BlurSection className="mxd-section">
          <div className="mxd-container grid-l-container">
            <div className="mxd-block loading-wrap">
              <div className="inner-headline">
                <div className="container-fluid p-0">
                  <div className="row g-0">
                    <div className="col-12 mxd-grid-item">
                      <CommonLoadFade index={0}>
                        <div className="inner-headline__breadcrumbs loading-fade">
                          <div className="breadcrumbs__nav">
                            <span>
                              <Link href={`/`}>
                                <TextScramble className="mxd-scramble">
                                  Home
                                </TextScramble>
                              </Link>
                            </span>
                            <span className="current-item">About </span>
                          </div>
                        </div>
                      </CommonLoadFade>
                    </div>
                    <div className="col-12">
                      <div className="inner-headline__content has-medium-title">
                        <div className="container-fluid p-0">
                          <div className="row g-0 align-items-center">
                            <div className="col-12 col-xl-7 mxd-grid-item">
                              <div className="technityze-about-tag-row">
                                <CommonLoadFade index={1}>
                                  <span className="technityze-about-tag loading-fade">
                                    Two people
                                  </span>
                                </CommonLoadFade>
                                <CommonLoadFade index={2}>
                                  <span className="technityze-about-tag loading-fade">
                                    No subcontractors
                                  </span>
                                </CommonLoadFade>
                                <CommonLoadFade index={3}>
                                  <span className="technityze-about-tag loading-fade">
                                    Belgrade, remote across EU
                                  </span>
                                </CommonLoadFade>
                              </div>
                              <div className="inner-headline__title">
                                <CommonAnimatedText
                                  as="h1"
                                  className="medium loading-split"
                                  animation="splitLinesLoad"
                                >
                                  Two builders.{" "}
                                  <span>One small studio.</span>
                                </CommonAnimatedText>
                              </div>
                              <div className="inner-headline__caption split-caption-title">
                                <div className="mxd-grid-item">
                                  <CommonAnimatedText
                                    as="p"
                                    className="t-bold t-large loading-split"
                                    animation="splitLinesLoad"
                                  >
                                    Technityze is two engineers who got tired of
                                    agency overhead and freelancer chaos.{" "}
                                    <span>
                                      No project managers, no
                                      &quot;resources&quot;, no slide decks. You
                                      talk to the people writing the code.
                                    </span>
                                  </CommonAnimatedText>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 col-xl-5 mxd-grid-item d-none d-xl-block">
                              <CommonLoadFade index={4}>
                                <div className="technityze-about-hero-art loading-fade">
                                  <span
                                    className="technityze-logo-mask technityze-about-hero-art__octopus"
                                    role="img"
                                    aria-label="Technityze octopus mascot"
                                  />
                                </div>
                              </CommonLoadFade>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mxd-block">
              <div className="fullwidth-text headline-email-text bottom-text-small mxd-grid-item">
                <div className="fullwidth-text__wrap">
                  <a
                    className="fullwidth-text__content small accent active-cursor"
                    data-cursor-text="Let's chat"
                    href="mailto:contact@technityze.com?subject=Project%20inquiry"
                    aria-label="Send email to contact@technityze.com"
                  >
                    <CommonAnimatedText
                      as="span"
                      className="anim-uni-chars"
                      animation="animChars"
                    >
                      contact@technityze.com
                    </CommonAnimatedText>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </BlurSection>
      </>
    </CommonLoadAnimation>
  );
}
