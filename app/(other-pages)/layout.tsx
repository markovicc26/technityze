"use client";

import { useEffect } from "react";
import TechnityzeFooter from "@/components/homes/technityze/TechnityzeFooter";

/* Inner pages: tag <body> so the global blur overlay (only useful on the
   home Hero parallax flow) stays hidden here, and use the brand footer
   instead of Technityze's default Footer2. */
export default function InnerPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.classList.add("technityze-inner-page");
    return () => {
      document.body.classList.remove("technityze-inner-page");
    };
  }, []);

  return (
    <>
      {children}
      <TechnityzeFooter />
    </>
  );
}
