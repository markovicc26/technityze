import { Metadata } from "next";
import InnerHeadline from "@/components/other-pages/about-us/InnerHeadline";
import Process from "@/components/other-pages/about-us/Process";
import Approach from "@/components/other-pages/about-us/Approach";
import CTAWithMarquee from "@/components/other-pages/services/CTAWithMarquee";

export const metadata: Metadata = {
  title: "About - Two builders, one small studio",
  description:
    "Technityze is two engineers shipping websites, mobile apps and SEO end-to-end. No project managers, no subcontractors. Belgrade, remote across EU.",
  alternates: { canonical: "/about-us" },
  openGraph: {
    title: "About - Two builders, one small studio",
    description:
      "Technityze is two engineers shipping websites, mobile apps and SEO end-to-end. No project managers, no subcontractors.",
    url: "/about-us",
  },
};

export default function AboutUsPage() {
  return (
    <div className="mxd-page-content inner-page-content">
      <InnerHeadline />
      <Process />
      <Approach />
      <CTAWithMarquee />
    </div>
  );
}
