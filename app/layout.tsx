import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { QueueProvider } from "@/contexts/queue-context";
import { MiniPlayer } from "@/components/player/mini-player";
import "./globals.css";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth"; // your BetterAuth helper

const binancePlex = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-binance-plex",
});

export const metadata: Metadata = {
  title: "Harmoniq",
  description:
    "Discover, upload, and share music with Harmoniq - the modern music streaming platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // try {
  //   const session = await auth.api.getSession({ headers: await headers() });

  //   if (!session?.user) {
  //     // If no session → force login
  //     redirect("/login");
  //   } else {
  //     // If logged in → force dashboard
  //     if (typeof window !== "undefined" && window.location.pathname === "/login") {
  //       redirect("/dashboard");
  //     }
  //   }
  // } catch (error) {
  //   console.error("Failed to fetch session in RootLayout:", error);
  //   redirect("/login"); // fallback to login
  // }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans ${binancePlex.variable} ${GeistMono.variable} antialiased`}
      >
        <Toaster />
        <Suspense fallback={null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueueProvider>
              <div className="min-h-screen flex flex-col">
                <main className="flex-1 pb-20">{children}</main>
                <div className="fixed bottom-0 left-0 right-0 z-50">
                  <MiniPlayer />
                </div>
              </div>
            </QueueProvider>
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
