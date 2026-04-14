import type React from "react";
import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Bebas_Neue } from "next/font/google";

import "./globals.css";
import { SmoothScroll } from "./_components/smooth-scroll";
import { Toaster } from "@/components/ui/sonner";
import ClickSpark from "@/components/animations/ClickSpark";
import { TanStackQueryProvider } from "@/app/providers/tanstack-query-provider";
import { ThemeProvider } from "@/components/animations/theme-provider";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
});
const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
});
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: "EDORA — AI-Powered Self-Learning Tracker",
  description:
    "EDORA helps students, mentors, and professionals design clear learning roadmaps, stay consistent, and grow with measurable outcomes — powered by AI and guided by humans.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{metadata.title as string}</title>
        <meta name="description" content={metadata.description || ""} />
      </head>
      <body
        className={`${ibmPlexSans.variable} ${bebasNeue.variable} ${ibmPlexMono.variable} font-sans antialiased overflow-x-hidden bg-background`}
        suppressHydrationWarning
      >
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TanStackQueryProvider>
            <div className="noise-overlay" aria-hidden="true" />
            <ClickSpark
              sparkColor="#ffffff"
              sparkSize={10}
              sparkRadius={15}
              sparkCount={8}
              duration={400}
              easing="ease-out"
              extraScale={1}
            />
            {children}
            <Toaster />
          </TanStackQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
