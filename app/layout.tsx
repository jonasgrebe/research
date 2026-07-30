import type { Metadata, Viewport } from "next";
import { AmbientField } from "./ambient-field";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000/";
const absoluteSiteUrl = siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;

export const metadata: Metadata = {
  metadataBase: new URL(absoluteSiteUrl),
  title: {
    default: "Research Index",
    template: "%s · Research Index",
  },
  description: "A compact index of research projects.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Research Index",
    description: "A compact index of research projects.",
    type: "website",
    images: [
      {
        url: new URL("og.png", absoluteSiteUrl),
        width: 1200,
        height: 630,
        alt: "Research Index — selected work from 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Research Index",
    description: "A compact index of research projects.",
    images: [new URL("og.png", absoluteSiteUrl)],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

const themeScript = `
  (function () {
    try {
      var preference = localStorage.getItem("research-theme") || "system";
      var resolved = preference === "system"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : preference;
      document.documentElement.dataset.themePreference = preference;
      document.documentElement.dataset.theme = resolved;
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
