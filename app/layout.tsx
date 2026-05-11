import type { Metadata } from "next";
import {
  Archivo_Narrow,
  Work_Sans,
  JetBrains_Mono,
  Newsreader,
} from "next/font/google";
import "./styles/base.css";
import "./styles/tokens.css";
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
