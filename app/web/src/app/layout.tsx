import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WatershedGeo — Geospatial Intelligence Platform",
  description:
    "Application of Geospatial Techniques for Visualization and Analysis to Interpret Geo-Coded Images to Enhance Watershed Development Outcomes. Ministry of Rural Development, Govt. of India.",
  keywords: [
    "watershed",
    "geospatial",
    "NDVI",
    "NDWI",
    "GIS",
    "remote sensing",
    "SRISHTI-DRISHTI",
    "India",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
