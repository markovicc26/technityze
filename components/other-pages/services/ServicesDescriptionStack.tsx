"use client";

import type { ReactNode } from "react";
import TextScramble from "@/components/animations/TextScramble";
import CommonServicesStack, {
  ServicesStackSlot,
} from "@/components/animations/CommonServicesStack";
import { ServiceVisualCard } from "./ServiceVisualCard";

type Card = {
  subtitle: string;
  title: string;
  tagCols: [string[], string[]];
  /* The light-theme image path. ServiceVisualCard appends `-dark` for the
     dark theme variant automatically (same convention as the home page). */
  image: string;
  imageAlt: string;
  /* Right-card extras: tech stack chips (always visible under the icon)
     and a terminal command that fades in on card hover. */
  techStack: string[];
  terminalCommand: string;
  descrClass: string;
  descr: ReactNode;
};

const CARDS: Card[] = [
  {
    subtitle: "01 / Services",
    title: "Websites",
    tagCols: [
      ["WordPress", "Next.js", "Headless CMS", "E-commerce"],
      ["Landing pages", "Self-hosted", "Maintenance"],
    ],
    image: "/img/technityze-icon-websites.png",
    imageAlt: "Pixel art clownfish inside a CRT monitor",
    techStack: ["WP", "Next.js", "Shopify", "Webflow"],
    terminalCommand: "technityze deploy --site=kapsulezakafu",
    descrClass: "t-large t-bold services-card__descr",
    descr: (
      <>
        Marketing sites and storefronts built to ship and keep running.
        WordPress when you need a CMS and editor handoff, Next.js when you
        need raw speed and a custom data layer.{" "}
        <span>
          We self-host the ones we operate, so there is no surprise plugin
          bill or migration call six months in.
        </span>
      </>
    ),
  },
  {
    subtitle: "02 / Services",
    title: "Mobile apps",
    tagCols: [
      ["React Native", "iOS", "Android", "Native modules"],
      ["Backend", "Auth", "Push", "Updates"],
    ],
    image: "/img/technityze-icon-mobile.png",
    imageAlt: "Pixel art seahorse inside a smartphone",
    techStack: ["React Native", "Expo", "Swift", "Kotlin"],
    terminalCommand: "npx expo run:ios --device",
    descrClass: "t-bold t-large services-card__descr",
    descr: (
      <>
        Cross-platform iOS and Android with backends that ship and keep
        running. React Native for most products, native modules where it
        pays off.{" "}
        <span>
          We deliver the App Store and Play submissions, the analytics
          wiring and the on-call cover for the first months after launch.
        </span>
      </>
    ),
  },
  {
    subtitle: "03 / Services",
    title: "SEO and ops",
    tagCols: [
      ["On-page SEO", "Tech audits", "Core Web Vitals", "Schema"],
      ["GA4", "Search Console", "Monthly reports"],
    ],
    image: "/img/technityze-icon-seo.png",
    imageAlt: "Pixel art crab climbing an ascending bar chart",
    techStack: ["Surfer", "GSC", "GA4", "Lighthouse"],
    terminalCommand: "technityze audit --site=careerpaths.rs",
    descrClass: "t-bold t-large services-card__descr",
    descr: (
      <>
        On-page optimization, content briefs and the monthly analytics
        someone actually reads. The site has to earn its traffic, not just
        exist.{" "}
        <span>
          We work in Surfer for density, Search Console for intent and our
          own audit tool for the technical layer, so every report ends with
          a decision and not a chart.
        </span>
      </>
    ),
  },
];

function Tag({ children }: { children: string }) {
  return (
    <TextScramble className="tag tag-s-mobile mxd-scramble">
      {children}
    </TextScramble>
  );
}

function ServiceCard({ card, index }: { card: Card; index: number }) {
  const [colA, colB] = card.tagCols;
  return (
    <ServicesStackSlot part="card" index={index}>
      <div className="mxd-stack-services__card">
        <ServicesStackSlot part="wrapper" index={index}>
          <div className="services-card__wrapper">
            <div className="services-card__content">
              <div className="services-card__info">
                <div className="services-card__subtitle">
                  <Tag>{card.subtitle}</Tag>
                </div>
                <div className="services-card__title">
                  <ServicesStackSlot part="title" index={index}>
                    <div className="services-card__title-text">
                      {card.title}
                    </div>
                  </ServicesStackSlot>
                </div>
                <ServicesStackSlot part="tags" index={index}>
                  <div className="services-card__tags">
                    <div className="tags-column">
                      {colA.map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                    <div className="tags-column">
                      {colB.map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  </div>
                </ServicesStackSlot>
              </div>
              <ServicesStackSlot part="descr" index={index}>
                <div className={card.descrClass}>{card.descr}</div>
              </ServicesStackSlot>
            </div>
            <ServicesStackSlot part="image" index={index}>
              <div className="services-card__image technityze-service-card__image">
                <ServiceVisualCard
                  imageSrc={card.image}
                  imageAlt={card.imageAlt}
                  techStack={card.techStack}
                  terminalCommand={card.terminalCommand}
                />
              </div>
            </ServicesStackSlot>
          </div>
        </ServicesStackSlot>
      </div>
    </ServicesStackSlot>
  );
}

export default function ServicesDescriptionStack() {
  return (
    <div id="services" className="mxd-section technityze-service-stack">
      <div className="mxd-container fullwidth-container">
        <div className="mxd-block">
          <CommonServicesStack className="mxd-stack-services">
            {CARDS.map((card, index) => (
              <ServiceCard key={card.subtitle} card={card} index={index} />
            ))}
          </CommonServicesStack>
        </div>
      </div>
    </div>
  );
}
