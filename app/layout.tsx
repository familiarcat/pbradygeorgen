import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { inter, roboto, merriweather, ibmPlexMono } from './fonts';
import "./globals.css";
import "./theme-variables.css";
import InitialThemeLoader from "@/components/InitialThemeLoader";
import PdfContentWrapper from "@/components/wrappers/PdfContentWrapper";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resume - Brady Georgen",
  description: "Professional resume for Brady Georgen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${roboto.variable} ${merriweather.variable} ${ibmPlexMono.variable} ${geistMono.variable} antialiased m-0 p-0 overflow-hidden`}
      >
        <InitialThemeLoader>
          <PdfContentWrapper>
            {children}
          </PdfContentWrapper>
        </InitialThemeLoader>
      </body>
    </html>
  );
}
