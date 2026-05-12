import type { Metadata } from "next";
import {
  Archivo_Narrow,
  Work_Sans,
  JetBrains_Mono,
  Newsreader,
} from "next/font/google";
import "./styles/base.css";
import "./styles/tokens.css";
// Design components — each file owns one component (or a tight family).
// Order among components doesn't matter; components compose tokens and
// the cross-cutting rules in tokens.css (hover-lift selector group,
// dark-surface selector group), never each other. Add new components
// here in the same alphabetical order.
import "./styles/components/audit.css";
import "./styles/components/btn.css";
import "./styles/components/card.css";
import "./styles/components/filebar.css";
import "./styles/components/form.css";
import "./styles/components/frame.css";
import "./styles/components/header.css";
import "./styles/components/image.css";
import "./styles/components/ledger.css";
import "./styles/components/link.css";
import "./styles/components/list.css";
import "./styles/components/mark.css";
import "./styles/components/quote.css";
import "./styles/components/slider.css";
import "./styles/components/trust.css";
import "./styles/readability.css";
import { ReadNav } from "@/app/_components/ReadNav";
import { SiteHeader } from "@/app/_components/SiteHeader";

// Webfonts for the design system. Each font sets a CSS custom property
// (--gd-font-*-loaded) on <html>; tokens.css reads those vars in the
// public --gd-font-* design tokens, with literal fallbacks inside var()
// so the cascade still works if a font fails to load.

const archivoNarrow = Archivo_Narrow({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--gd-font-display-loaded",
  display: "swap",
});

const workSans = Work_Sans({
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--gd-font-body-loaded",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--gd-font-mono-loaded",
  display: "swap",
});

const newsreader = Newsreader({
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--gd-font-serif-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Design",
  description: "Design system reference for ra-v2.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontVariables = `${archivoNarrow.variable} ${workSans.variable} ${jetbrainsMono.variable} ${newsreader.variable}`;
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <ReadNav />
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
