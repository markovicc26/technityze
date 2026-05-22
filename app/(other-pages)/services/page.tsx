import { Metadata } from "next";
import InnerHeadline from "@/components/other-pages/services/InnerHeadline";
import ServicesDescriptionStack from "@/components/other-pages/services/ServicesDescriptionStack";
import ProjectsGrid from "@/components/homes/technityze/ProjectsGrid";
import CTAWithMarquee from "@/components/other-pages/services/CTAWithMarquee";

export const metadata: Metadata = {
  title: "Services - Web, mobile and SEO done end-to-end",
  description:
    "Three things, done end-to-end: websites and storefronts, mobile apps, and on-page SEO with monthly operations. Built in WordPress, Next.js, React Native and Shopify.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services - Web, mobile and SEO done end-to-end",
    description:
      "Three things, done end-to-end: websites and storefronts, mobile apps, and on-page SEO with monthly operations.",
    url: "/services",
  },
};

export default function ServicesPage() {
  return (
    <>
      <InnerHeadline />
      <ServicesDescriptionStack />
      <ProjectsGrid />
      <CTAWithMarquee />
    </>
  );
}
