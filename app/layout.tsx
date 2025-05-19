import { Geist_Mono } from "next/font/google";
import { inter, roboto, merriweather, sourceSans } from './fonts';
import "./globals.css";
import "../styles/pdf-theme.css"; // Import the PDF theme CSS
import "../styles/pdf-global-styles.css"; // Import the PDF global styles with high specificity
import DirectStyleInjector from "@/components/DirectStyleInjector"; // Import the direct style injector
import "../public/force-text-color.css"; // Import the force text color CSS

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
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          /* Emergency text color fix */
          body, h1, h2, h3, h4, h5, h6, p, span, div, li, td, th, label { color: #000000 !important; }
          .siteTitle, [class*="siteTitle"] { color: #000000 !important; }
          [class*="markdownPreview"] * { color: #000000 !important; }
          [class*="actionLink"], [class*="actionLink"] * { color: #FFFFFF !important; }
        `}} />
      </head>
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
