import "@/styles/template.css";
import { JetBrains_Mono, Manrope } from "next/font/google";
import Header1 from "@/components/headers/Header1";
import TemplateRuntimeProvider from "@/components/common/TemplateRuntimeProvider";
import MenuRuntimeShell from "@/components/headers/MenuRuntimeShell";
import { Metadata } from "next";
import { cookies } from "next/headers";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const SITE_URL = "https://technityze.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Technityze - Two builders shipping websites, apps and SEO",
    template: "%s | Technityze",
  },
  description:
    "Technityze is a two-person studio building marketing sites, mobile apps and ongoing SEO for businesses that take operations seriously. Belgrade, remote across EU.",
  applicationName: "Technityze",
  authors: [{ name: "Technityze" }],
  generator: "Next.js",
  keywords: [
    "web development",
    "Next.js",
    "WordPress",
    "mobile apps",
    "SEO",
    "Serbia",
    "Belgrade",
    "small studio",
    "boutique agency",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Technityze",
    title: "Technityze - Two builders shipping websites, apps and SEO",
    description:
      "Two-person studio building websites, mobile apps and ongoing SEO. No project managers, no subcontractors. Belgrade, remote across EU.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Technityze - Two builders shipping websites, apps and SEO",
    description:
      "Two-person studio building websites, mobile apps and ongoing SEO. No project managers, no subcontractors.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get("template.theme")?.value;
  const initialTheme = cookieTheme === "light" ? "light" : "dark";

  return (
    <html
      lang="en"
      className="no-touch"
      color-scheme={initialTheme}
      suppressHydrationWarning
    >
      <body
        className={`${manrope.variable} ${jetbrainsMono.variable}`}
        suppressHydrationWarning
      >
        <TemplateRuntimeProvider>
          <Header1 initialTheme={initialTheme} />
          <MenuRuntimeShell />
          {children}
        </TemplateRuntimeProvider>
      </body>
    </html>
  );
}
