import type { Metadata, Viewport } from "next";
import { AmbientField } from "./ambient-field";
import "./globals.css";

import {researchSite} from "./paper-metadata";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(researchSite),
  title: {
    default: "Overview",
    template: "%s · Overview",
  },
  description: "A compact overview of research projects.",
  icons: {
    icon: [
      { url: `${basePath}/favicon-32.png?v=3`, type: "image/png", sizes: "32x32" },
      { url: `${basePath}/favicon.svg?v=3`, type: "image/svg+xml", sizes: "any" },
    ],
  },
  openGraph: {
    title: "Overview",
    description: "A compact overview of research projects.",
    type: "website",
    images: [
      {
        url: new URL("og-v2.png", researchSite),
        width: 1200,
        height: 630,
        alt: "Overview — selected research work from 2024 to 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Overview",
    description: "A compact overview of research projects.",
    images: [new URL("og-v2.png", researchSite)],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

const themeScript = `
  (function () {
    if (location.pathname.split("/").includes("card-art")) return;
    try {
      var storedPreference = localStorage.getItem("research-theme");
      var preference = storedPreference === "light" || storedPreference === "dark"
        ? storedPreference
        : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      localStorage.setItem("research-theme", preference);
      document.documentElement.dataset.themePreference = preference;
      document.documentElement.dataset.theme = preference;
    } catch (_) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <AmbientField />
        {children}
      </body>
    </html>
  );
}
