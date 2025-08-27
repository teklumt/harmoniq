"use client"

import type React from "react"

import { MusicProvider } from "@/components/music-context"

export default function Template({ children }: { children: React.ReactNode }) {
  return <MusicProvider>{children}</MusicProvider>
}
