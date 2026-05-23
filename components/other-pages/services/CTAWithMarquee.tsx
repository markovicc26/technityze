"use client";

import BlurSection from "@/components/animations/BlurSection";
import { initCtaMarqueeToLeft } from "@/lib/template/ctaMarqueeEffects";
import Link from "next/link";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { CommonScrollAnimated } from "@/components/animations/CommonScrollAnimated";
import CommonAnimatedText from "@/components/animations/CommonAnimatedText";
import TextScramble from "@/components/animations/TextScramble";

/* Marquee items - our actual project screenshots + a tech-stack tag each.
   The list is rendered twice so the GSAP left-loop has enough content to
   scroll continuously without an empty seam. */
type MarqueeItem = {
  src: string;
  alt: string;
  w: number;
  h: number;
  tag: string;
};

const MARQUEE: MarqueeItem[] = [
  {
    src: "/img/technityze/work/kapsulezakafu.png",
    alt: "Kapsule za kafu",
    w: 1280,
    h: 800,
    tag: "Next.js · E-commerce",
  },
  {
    src: "/img/technityze/work/careerpaths.png",
    alt: "CareerPaths",
    w: 1280,
    h: 800,
    tag: "WordPress · Lead gen",
  },
  {
    src: "/img/technityze/work/pingala-saas-marquee.jpg",
    alt: "Pingala internal SaaS — login, calendar, and finances",
    w: 1024,
    h: 686,
    tag: "React Native · SaaS",
  },
  {
    src: "/img/technityze/work/astroskop.png",
    alt: "Astroskop",
    w: 1280,
    h: 800,
    tag: "Next.js · Editorial",
  },
  {
    src: "/img/technityze/work/operations-vigo-hero.jpg",
    alt: "Vigo operations app — sign-in, calendar, and job forms",
    w: 1024,
    h: 686,
    tag: "React Native · SaaS",
  },
];

export default function CTAWithMarquee() {
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    return initCtaMarqueeToLeft(marqueeTrackRef.current);
  }, []);
  return (
    <>
      <BlurSection className="mxd-section bg-color-opposite">
        <div className="mxd-container fullwidth-container">
          {/* Block - CTA with Matter.js Objects Start */}
          <div className="mxd-block">
            <div className="mxd-promo transparent">
              <div className="mxd-promo__wrap auto-height">
                {/* content */}
                <div className="mxd-promo__content">
                  <CommonScrollAnimated
                    className="mxd-promo__btngroup anim-uni-in-up"
                    as="div"
                    animation="inUp"
                  >
                    <Link
                      className="btn btn-line btn-line-opposite"
                      href={`/contact`}
                    >
                      <TextScramble className="btn-caption mxd-scramble">
                        Start a project
                      </TextScramble>
                    </Link>
                  </CommonScrollAnimated>
                  <div className="mxd-promo__caption">
                    <Link
                      className="active-cursor-accent"
                      data-cursor-text="Let's Talk"
                      href={`/contact`}
                    >
                      <CommonAnimatedText
                        as="h2"
                        className="reveal-type opposite"
                        animation="revealType"
                      >
                        Have something you want shipped?
                      </CommonAnimatedText>
                    </Link>
                  </div>
                </div>
                {/* marquee - our project screenshots, doubled for seamless loop */}
                <div className="mxd-promo__marquee">
                  <div className="marquee marquee-left--gsap">
                    <div
                      className="marquee__toleft marquee__images"
                      ref={marqueeTrackRef}
                    >
                      {[...MARQUEE, ...MARQUEE].map((item, i) => (
                        <div
                          key={`${item.src}-${i}`}
                          className="marquee__item item-imageblock"
                        >
                          <div className="marquee__tags">
                            <TextScramble className="tag tag-s tag-medium mxd-scramble">
                              {item.tag}
                            </TextScramble>
                          </div>
                          <div className="marquee__image">
                            <Image
                              alt={item.alt}
                              src={item.src}
                              width={item.w}
                              height={item.h}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Block - CTA with Matter.js Objects End */}
        </div>
      </BlurSection>
    </>
  );
}
