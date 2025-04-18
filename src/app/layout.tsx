import type { Metadata } from "next";
import "./globals.css";

/**
 * Metadata for the PDF viewer page
 */
export const metadata: Metadata = {
  title: "Brady Georgen Resume",
  description: "Brady Georgen's Resume PDF",
};

/**
 * Root layout that only includes the PDF viewer
 * No styling, no fonts, no navigation, just the PDF
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}
