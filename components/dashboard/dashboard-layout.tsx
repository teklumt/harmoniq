"use client";

import type React from "react";
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MusicPlayer } from "@/components/player/music-player";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Button
          variant="ghost"
          size="sm"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 md:ml-64">
          <div className="p-4 pt-16 pb-24 md:p-8 md:pt-8">{children}</div>
        </main>
      </div>

      {/* Music Player */}
      <MusicPlayer />
    </div>
  );
}
