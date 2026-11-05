import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import MobileNav from "@/components/MobileNav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Keja Yangu — Find Your Home in Kenya",
  description: "Kenya's most trusted property marketplace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} pb-16 md:pb-0`}>
          {children}
          <MobileNav />
        </body>
      </html>
    </ClerkProvider>
  );
}