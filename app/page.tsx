import { Metadata } from "next";
import Hero from "@/components/homes/technityze/Hero";
import WhoIsItFor from "@/components/homes/technityze/WhoIsItFor";
import Pong from "@/components/homes/technityze/Pong";
import MeetTheOps from "@/components/homes/technityze/MeetTheOps";
import ProjectsGrid from "@/components/homes/technityze/ProjectsGrid";
import CTA from "@/components/homes/technityze/CTA";
import TechnityzeFooter from "@/components/homes/technityze/TechnityzeFooter";
import HideGlobalBlur from "@/components/animations/HideGlobalBlur";

export const metadata: Metadata = {
  title: "Technityze - Two builders shipping websites, apps and SEO",
  description:
    "Two-person studio building marketing sites, mobile apps and ongoing SEO. No project managers, no subcontractors. Belgrade, remote across EU.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Technityze - Two builders shipping websites, apps and SEO",
    description:
      "Two-person studio building marketing sites, mobile apps and ongoing SEO. No project managers, no subcontractors. Belgrade, remote across EU.",
    url: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhoIsItFor />
      <Pong />
      <MeetTheOps />
      <ProjectsGrid />
      <CTA />
      <HideGlobalBlur />
      <TechnityzeFooter />
    </>
  );
}
