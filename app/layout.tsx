import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { inter, roboto, merriweather, ibmPlexMono } from './fonts';
import "./globals.css";
import InitialThemeLoader from "@/components/InitialThemeLoader";
import PdfContentWrapper from "@/components/wrappers/PdfContentWrapper";
import DynamicMetadata from "@/components/DynamicMetadata";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Dynamic metadata generation
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Import the getMetadata function
    const { getMetadata } = await import('./actions/getMetadata');

    // Get the metadata from the server action
    const metadata = await getMetadata();

    return metadata;
  } catch (error) {
    // Fallback metadata in case the dynamic metadata fails
    return {
      title: "Professional Resume",
      description: "Professional resume created with AlexAI",
    };
  }
}

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
        {/* DynamicMetadata updates the document title and description based on the extracted name */}
        <DynamicMetadata />
        <InitialThemeLoader>
          <PdfContentWrapper>
            {children}
          </PdfContentWrapper>
        </InitialThemeLoader>
      </body>
    </html>
  );
}
