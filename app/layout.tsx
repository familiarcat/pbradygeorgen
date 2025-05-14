import { Geist_Mono } from "next/font/google";
import { inter, roboto, merriweather, sourceSans } from './fonts';
import "./globals.css";
import "../styles/pdf-theme.css"; // Import the PDF theme CSS
import "../styles/pdf-global-styles.css"; // Import the PDF global styles with high specificity
import DirectStyleInjector from "@/components/DirectStyleInjector"; // Import the direct style injector

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${roboto.variable} ${merriweather.variable} ${sourceSans.variable} ${geistMono.variable} antialiased m-0 p-0`}
      >
        {/* Inject PDF styles directly into the document head */}
        <DirectStyleInjector />

        {/* Navigation is hidden on the home page since it has its own Salinger header */}
        {children}
      </body>
    </html>
  );
}
