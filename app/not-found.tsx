import { Metadata } from "next";
import NotFound from "@/components/other-pages/404/NotFound";
import TechnityzeFooter from "@/components/homes/technityze/TechnityzeFooter";

export const metadata: Metadata = {
  title: "404 | Technityze",
  description: "Page not found.",
  robots: { index: false, follow: false },
};

export default function NotFoundPage() {
  return (
    <>
      <NotFound />
      <TechnityzeFooter />
    </>
  );
}
