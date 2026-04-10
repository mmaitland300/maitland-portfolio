import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { MotionProvider } from "@/components/layout/motion-provider";
import { PAGE_TITLE_GRADIENT } from "@/lib/page-title-gradient";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Matt Maitland | Developer",
    template: "%s | Matt Maitland",
  },
  description:
    "Matt Maitland: web systems, audio/DSP, and production troubleshooting. Projects, blog, and contact.",
  keywords: [
    "developer",
    "personal site",
    "full-stack",
    "Next.js",
    "TypeScript",
    "React",
  ],
  authors: [{ name: "Matt Maitland" }],
  creator: "Matt Maitland",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Matt Maitland",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--page-title-gradient:${PAGE_TITLE_GRADIENT}}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col relative">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
