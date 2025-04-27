import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { inter, roboto, merriweather, sourceSans } from './fonts';
import "./globals.css";
import InitialThemeLoader from "@/components/InitialThemeLoader";

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
        className={`${inter.variable} ${roboto.variable} ${merriweather.variable} ${sourceSans.variable} ${geistMono.variable} antialiased m-0 p-0 overflow-hidden`}
      >
        <InitialThemeLoader>
          {children}
        </InitialThemeLoader>
      </body>
    </html>
  );
}
