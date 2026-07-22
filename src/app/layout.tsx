import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/navigation";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://atlas-null.example"),
  title: {
    default: "ATLAS//NULL — Spatial Systems Studio",
    template: "%s — ATLAS//NULL",
  },
  description:
    "ATLAS//NULL engineers spatial systems, real-time interfaces and impossible digital experiences.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "ATLAS//NULL",
    title: "ATLAS//NULL — Spatial Systems Studio",
    description: "We engineer impossible interfaces.",
    images: [
      {
        url: `${basePath}/og-atlas-null.png`,
        width: 1728,
        height: 917,
        alt: "ATLAS//NULL — We engineer impossible interfaces.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ATLAS//NULL — Spatial Systems Studio",
    description: "We engineer impossible interfaces.",
    images: [`${basePath}/og-atlas-null.png`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050706",
};

export interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
