"use client"

import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from "react"

interface Track {
  id: string
  title: string
  artist: string
  duration: string
  cover?: string
  album?: string
  audioUrl?: string
}

interface MusicContextType {
  currentTrack: Track | null
  isPlaying: boolean
  queue: Track[]
  searchQuery: string
  setCurrentTrack: (track: Track) => void
  setIsPlaying: (playing: boolean) => void
  addToQueue: (track: Track) => void
  setSearchQuery: (query: string) => void
  playNext: () => void
  playPrevious: () => void
  toggleLike: (trackId: string) => void
  likedTracks: Set<string>
  currentTime: number
  duration: number
  volume: number
  setVolume: (volume: number) => void
  seekTo: (time: number) => void
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [queue, setQueue] = useState<Track[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set())
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(75)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playPromiseRef = useRef<Promise<void> | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio()
      audioRef.current.volume = volume / 100

      const audio = audioRef.current

      const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
      const handleDurationChange = () => setDuration(audio.duration)
      const handleEnded = () => {
        setIsPlaying(false)
        playNext()
      }
      const handleError = (e: Event) => {
        console.log("[v0] Audio error:", e)
        setIsPlaying(false)
      }

      audio.addEventListener("timeupdate", handleTimeUpdate)
      audio.addEventListener("durationchange", handleDurationChange)
      audio.addEventListener("ended", handleEnded)
      audio.addEventListener("error", handleError)

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate)
        audio.removeEventListener("durationchange", handleDurationChange)
        audio.removeEventListener("ended", handleEnded)
        audio.removeEventListener("error", handleError)
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        if (playPromiseRef.current) {
          playPromiseRef.current
            .then(() => {
              if (audioRef.current && isPlaying) {
                playPromiseRef.current = audioRef.current.play().catch((error) => {
                  console.log("[v0] Play error:", error)
                  setIsPlaying(false)
                })
              }
            })
            .catch(() => {
              if (audioRef.current && isPlaying) {
                playPromiseRef.current = audioRef.current.play().catch((error) => {
                  console.log("[v0] Play error:", error)
                  setIsPlaying(false)
                })
              }
            })
        } else {
          playPromiseRef.current = audioRef.current.play().catch((error) => {
            console.log("[v0] Play error:", error)
            setIsPlaying(false)
          })
        }
      } else {
        if (playPromiseRef.current) {
          playPromiseRef.current
            .then(() => {
              if (audioRef.current) {
                audioRef.current.pause()
              }
            })
            .catch(() => {
              if (audioRef.current) {
                audioRef.current.pause()
              }
            })
            .finally(() => {
              playPromiseRef.current = null
            })
        } else {
          audioRef.current.pause()
        }
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (playPromiseRef.current) {
        playPromiseRef.current
          .then(() => {
            loadNewTrack()
          })
          .catch(() => {
            loadNewTrack()
          })
      } else {
        loadNewTrack()
      }
    }

    function loadNewTrack() {
      if (audioRef.current && currentTrack) {
        audioRef.current.pause()
        audioRef.current.src = currentTrack.audioUrl || "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
        audioRef.current.load()

        if (isPlaying) {
          const playWhenReady = () => {
            if (audioRef.current) {
              playPromiseRef.current = audioRef.current.play().catch((error) => {
                console.log("[v0] Play error after load:", error)
                setIsPlaying(false)
              })
            }
          }

          if (audioRef.current.readyState >= 2) {
            playWhenReady()
          } else {
            audioRef.current.addEventListener("canplay", playWhenReady, { once: true })
          }
        }
      }
    }
  }, [currentTrack])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  const addToQueue = (track: Track) => {
    setQueue((prev) => [...prev, track])
  }

  const playNext = () => {
    if (queue.length > 0) {
      const nextTrack = queue[0]
      setCurrentTrack(nextTrack)
      setQueue((prev) => prev.slice(1))
    }
  }

  const playPrevious = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }

  const toggleLike = (trackId: string) => {
    setLikedTracks((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(trackId)) {
        newSet.delete(trackId)
      } else {
        newSet.add(trackId)
      }
      return newSet
    })
  }

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        queue,
        searchQuery,
        setCurrentTrack,
        setIsPlaying,
        addToQueue,
        setSearchQuery,
        playNext,
        playPrevious,
        toggleLike,
        likedTracks,
        currentTime,
        duration,
        volume,
        setVolume,
        seekTo,
      }}
    >
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider")
  }
  return context
}

export const useMusicContext = useMusic
