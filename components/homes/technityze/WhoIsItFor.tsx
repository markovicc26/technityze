"use client";

import BlurSection from "@/components/animations/BlurSection";
import HoverScrambleHeading from "@/components/animations/HoverScrambleHeading";
import TextScramble from "@/components/animations/TextScramble";
import { Globe, Smartphone, LineChart } from "lucide-react";
import { ProductHighlightCard } from "./ProductHighlightCard";

type Service = {
  category: string;
  categoryIcon: React.ReactNode;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

const SERVICES: Service[] = [
  {
    category: "Web",
    categoryIcon: <Globe className="technityze-phc__icon-svg" />,
    title: "Websites",
    description:
      "Marketing sites and storefronts. WordPress when you need a CMS, Next.js when you need speed.",
    imageSrc: "/img/technityze-icon-websites.png",
    imageAlt: "Pixel art clownfish inside a CRT monitor",
  },
  {
    category: "Mobile",
    categoryIcon: <Smartphone className="technityze-phc__icon-svg" />,
    title: "Mobile apps",
    description:
      "iOS and Android with backends that ship and keep running. Native where it pays off.",
    imageSrc: "/img/technityze-icon-mobile.png",
    imageAlt: "Pixel art seahorse inside a smartphone screen",
  },
  {
    category: "Growth",
    categoryIcon: <LineChart className="technityze-phc__icon-svg" />,
    title: "SEO and ops",
    description:
      "On-page optimization and monthly analytics. The site has to earn its traffic, not just exist.",
    imageSrc: "/img/technityze-icon-seo.png",
    imageAlt: "Pixel art crab climbing an ascending bar chart",
  },
];

export default function WhoIsItFor() {
  return (
    <BlurSection
      id="services"
      className="mxd-section padding-bottom-grid-l-to-title technityze-what-we-do"
    >
      <div className="technityze-what-we-do__card-wrap">
        <div className="mxd-container grid-l-container">
          {/* Eyebrow + full-width headline */}
          <div className="mxd-block">
            <div className="technityze-what-we-do__intro">
              <TextScramble className="technityze-what-we-do__eyebrow mxd-scramble">
                What we do
              </TextScramble>
              <HoverScrambleHeading
                as="h2"
                className="technityze-what-we-do__headline"
                text="Three things, done end-to-end."
              />
            </div>
          </div>

          {/* 3 product highlight cards */}
          <div className="mxd-block">
            <div className="technityze-what-we-do__cards">
              {SERVICES.map((service) => (
                <ProductHighlightCard
                  key={service.title}
                  category={service.category}
                  categoryIcon={service.categoryIcon}
                  title={service.title}
                  description={service.description}
                  imageSrc={service.imageSrc}
                  imageAlt={service.imageAlt}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </BlurSection>
  );
}
