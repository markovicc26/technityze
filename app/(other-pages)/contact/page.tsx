import { Metadata } from "next";
import InnerHeadline from "@/components/other-pages/contact/InnerHeadline";
import Socials from "@/components/other-pages/contact/Socials";

export const metadata: Metadata = {
  title: "Contact - Let's talk about your project",
  description:
    "Tell us what you're building. We'll get back within one business day with a clear next step or an honest no.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact - Let's talk about your project",
    description:
      "Tell us what you're building. We'll get back within one business day with a clear next step or an honest no.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="mxd-page-content inner-page-content">
      <InnerHeadline />
      <Socials />
    </div>
  );
}
