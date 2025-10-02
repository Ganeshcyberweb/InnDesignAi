import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from '@/components/ui/sonner'
import { Providers } from '@/lib/providers'
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "InnDesign | AI-Powered Interior Design",
  description: "Transform your spaces with AI-powered interior design tools. Create stunning room designs, get personalized recommendations, and visualize your dream spaces with InnDesign.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
