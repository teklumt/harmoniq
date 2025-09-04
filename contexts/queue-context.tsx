"use client"

import type React from "react"
import { createContext, useContext, useReducer, useRef, useEffect, useCallback } from "react"
import type { Track, Album, Playlist, QueueItem, QueueState, PlayerControls, QueueActions } from "@/lib/types/music"

interface QueueContextType {
  state: QueueState
  controls: PlayerControls
  actions: QueueActions
  currentTrack: Track | null
  audioRef: React.RefObject<HTMLAudioElement>
}

const QueueContext = createContext<QueueContextType | null>(null)

// Queue reducer for state management
type QueueAction =
  | { type: "SET_QUEUE"; payload: QueueItem[] }
  | { type: "ADD_ITEM"; payload: QueueItem }
  | { type: "ADD_ITEMS"; payload: QueueItem[] }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_QUEUE" }
  | { type: "MOVE_ITEM"; payload: { fromIndex: number; toIndex: number } }
  | { type: "SET_CURRENT_INDEX"; payload: number }
  | { type: "SET_PLAYING"; payload: boolean }
  | { type: "SET_PAUSED"; payload: boolean }
  | { type: "SET_SHUFFLE"; payload: boolean }
  | { type: "SET_REPEAT"; payload: "none" | "one" | "all" }
  | { type: "SET_VOLUME"; payload: number }
  | { type: "SET_CURRENT_TIME"; payload: number }
  | { type: "SET_DURATION"; payload: number }
  | { type: "PLAY_NEXT" }
  | { type: "PLAY_PREVIOUS" }

const initialState: QueueState = {
  items: [],
  currentIndex: -1,
  isPlaying: false,
  isPaused: false,
  isShuffled: false,
  repeatMode: "none",
  volume: 1,
  currentTime: 0,
  duration: 0,
}

function queueReducer(state: QueueState, action: QueueAction): QueueState {
  switch (action.type) {
    case "SET_QUEUE":
      return {
        ...state,
        items: action.payload,
        currentIndex: action.payload.length > 0 ? 0 : -1,
      }

    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, action.payload],
        currentIndex: state.currentIndex === -1 ? 0 : state.currentIndex,
      }

    case "ADD_ITEMS":
      const newItems = [...state.items, ...action.payload]
      return {
        ...state,
        items: newItems,
        currentIndex: state.currentIndex === -1 && newItems.length > 0 ? 0 : state.currentIndex,
      }

    case "REMOVE_ITEM":
      const filteredItems = state.items.filter((item) => item.id !== action.payload)
      const removedIndex = state.items.findIndex((item) => item.id === action.payload)
      let newCurrentIndex = state.currentIndex

      if (removedIndex !== -1) {
        if (removedIndex < state.currentIndex) {
          newCurrentIndex = state.currentIndex - 1
        } else if (removedIndex === state.currentIndex) {
          newCurrentIndex = Math.min(state.currentIndex, filteredItems.length - 1)
        }
      }

      return {
        ...state,
        items: filteredItems,
        currentIndex: filteredItems.length === 0 ? -1 : newCurrentIndex,
      }

    case "CLEAR_QUEUE":
      return {
        ...state,
        items: [],
        currentIndex: -1,
        isPlaying: false,
        isPaused: false,
        currentTime: 0,
        duration: 0,
      }

    case "MOVE_ITEM":
      const { fromIndex, toIndex } = action.payload
      const items = [...state.items]
      const [movedItem] = items.splice(fromIndex, 1)
      items.splice(toIndex, 0, movedItem)

      let updatedCurrentIndex = state.currentIndex
      if (fromIndex === state.currentIndex) {
        updatedCurrentIndex = toIndex
      } else if (fromIndex < state.currentIndex && toIndex >= state.currentIndex) {
        updatedCurrentIndex = state.currentIndex - 1
      } else if (fromIndex > state.currentIndex && toIndex <= state.currentIndex) {
        updatedCurrentIndex = state.currentIndex + 1
      }

      return {
        ...state,
        items,
        currentIndex: updatedCurrentIndex,
      }

    case "SET_CURRENT_INDEX":
      return {
        ...state,
        currentIndex: action.payload,
        currentTime: 0,
      }

    case "SET_PLAYING":
      return {
        ...state,
        isPlaying: action.payload,
        isPaused: !action.payload,
      }

    case "SET_PAUSED":
      return {
        ...state,
        isPaused: action.payload,
        isPlaying: !action.payload,
      }

    case "SET_SHUFFLE":
      return {
        ...state,
        isShuffled: action.payload,
      }

    case "SET_REPEAT":
      return {
        ...state,
        repeatMode: action.payload,
      }

    case "SET_VOLUME":
      return {
        ...state,
        volume: Math.max(0, Math.min(1, action.payload)),
      }

    case "SET_CURRENT_TIME":
      return {
        ...state,
        currentTime: action.payload,
      }

    case "SET_DURATION":
      return {
        ...state,
        duration: action.payload,
      }

    case "PLAY_NEXT":
      if (state.items.length === 0) return state

      let nextIndex = state.currentIndex + 1

      if (state.repeatMode === "one") {
        nextIndex = state.currentIndex
      } else if (nextIndex >= state.items.length) {
        nextIndex = state.repeatMode === "all" ? 0 : state.currentIndex
      }

      return {
        ...state,
        currentIndex: nextIndex,
        currentTime: 0,
      }

    case "PLAY_PREVIOUS":
      if (state.items.length === 0) return state

      let prevIndex = state.currentIndex - 1

      if (prevIndex < 0) {
        prevIndex = state.repeatMode === "all" ? state.items.length - 1 : 0
      }

      return {
        ...state,
        currentIndex: prevIndex,
        currentTime: 0,
      }

    default:
      return state
  }
}

export function QueueProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(queueReducer, initialState)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Get current track
  const currentTrack =
    state.currentIndex >= 0 && state.currentIndex < state.items.length ? state.items[state.currentIndex].track : null

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      dispatch({ type: "SET_CURRENT_TIME", payload: audio.currentTime })
    }

    const handleDurationChange = () => {
      dispatch({ type: "SET_DURATION", payload: audio.duration || 0 })
    }

    const handleEnded = () => {
      dispatch({ type: "SET_PLAYING", payload: false })
      // controls.next() // Removed to avoid invalid use before declaration
    }

    const handleLoadStart = () => {
      dispatch({ type: "SET_CURRENT_TIME", payload: 0 })
      dispatch({ type: "SET_DURATION", payload: 0 })
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("durationchange", handleDurationChange)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("loadstart", handleLoadStart)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("durationchange", handleDurationChange)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("loadstart", handleLoadStart)
    }
  }, [])

  // Player controls
  const controls: PlayerControls = {
    play: useCallback(() => {
      const audio = audioRef.current
      if (!audio || !currentTrack) return

      audio
        .play()
        .then(() => {
          dispatch({ type: "SET_PLAYING", payload: true })
        })
        .catch(console.error)
    }, [currentTrack]),

    pause: useCallback(() => {
      const audio = audioRef.current
      if (!audio) return

      audio.pause()
      dispatch({ type: "SET_PAUSED", payload: true })
    }, []),

    stop: useCallback(() => {
      const audio = audioRef.current
      if (!audio) return

      audio.pause()
      audio.currentTime = 0
      dispatch({ type: "SET_PLAYING", payload: false })
      dispatch({ type: "SET_CURRENT_TIME", payload: 0 })
    }, []),

    next: useCallback(() => {
      dispatch({ type: "PLAY_NEXT" })
    }, []),

    previous: useCallback(() => {
      dispatch({ type: "PLAY_PREVIOUS" })
    }, []),

    seek: useCallback((time: number) => {
      const audio = audioRef.current
      if (!audio) return

      audio.currentTime = time
      dispatch({ type: "SET_CURRENT_TIME", payload: time })
    }, []),

    setVolume: useCallback((volume: number) => {
      const audio = audioRef.current
      const clampedVolume = Math.max(0, Math.min(1, volume))

      if (audio) {
        audio.volume = clampedVolume
      }
      dispatch({ type: "SET_VOLUME", payload: clampedVolume })
    }, []),

    toggleShuffle: useCallback(() => {
      dispatch({ type: "SET_SHUFFLE", payload: !state.isShuffled })
    }, [state.isShuffled]),

    toggleRepeat: useCallback(() => {
      const modes: Array<"none" | "one" | "all"> = ["none", "one", "all"]
      const currentIndex = modes.indexOf(state.repeatMode)
      const nextMode = modes[(currentIndex + 1) % modes.length]
      dispatch({ type: "SET_REPEAT", payload: nextMode })
    }, [state.repeatMode]),
  }

  // Queue actions
  const actions: QueueActions = {
    addTrack: useCallback((track: Track, source) => {
      const queueItem: QueueItem = {
        id: `${track.id}-${Date.now()}`,
        track,
        source: source || {
          type: "single",
          id: track.id,
          name: track.title,
        },
        addedAt: new Date().toISOString(),
      }
      dispatch({ type: "ADD_ITEM", payload: queueItem })
    }, []),

    addAlbum: useCallback((album: Album) => {
      const queueItems: QueueItem[] = album.tracks.map((track, index) => ({
        id: `${track.id}-${album.id}-${Date.now()}-${index}`,
        track,
        source: {
          type: "album",
          id: album.id,
          name: album.title,
        },
        addedAt: new Date().toISOString(),
      }))
      dispatch({ type: "ADD_ITEMS", payload: queueItems })
    }, []),

    addPlaylist: useCallback((playlist: Playlist) => {
      const queueItems: QueueItem[] = playlist.tracks.map((track, index) => ({
        id: `${track.id}-${playlist.id}-${Date.now()}-${index}`,
        track,
        source: {
          type: "playlist",
          id: playlist.id,
          name: playlist.name,
        },
        addedAt: new Date().toISOString(),
      }))
      dispatch({ type: "ADD_ITEMS", payload: queueItems })
    }, []),

    removeItem: useCallback((itemId: string) => {
      dispatch({ type: "REMOVE_ITEM", payload: itemId })
    }, []),

    clearQueue: useCallback(() => {
      dispatch({ type: "CLEAR_QUEUE" })
    }, []),

    moveItem: useCallback((fromIndex: number, toIndex: number) => {
      dispatch({ type: "MOVE_ITEM", payload: { fromIndex, toIndex } })
    }, []),

    playFromIndex: useCallback(
      (index: number) => {
        dispatch({ type: "SET_CURRENT_INDEX", payload: index })
        // Auto-play when selecting a track
        setTimeout(() => controls.play(), 100)
      },
      [state],
    ), // Updated to use state instead of controls

    playNext: useCallback(
      (track: Track, source) => {
        const queueItem: QueueItem = {
          id: `${track.id}-next-${Date.now()}`,
          track,
          source: source || {
            type: "single",
            id: track.id,
            name: track.title,
          },
          addedAt: new Date().toISOString(),
        }

        const insertIndex = state.currentIndex + 1
        const newItems = [...state.items]
        newItems.splice(insertIndex, 0, queueItem)
        dispatch({ type: "SET_QUEUE", payload: newItems })
      },
      [state],
    ), // Updated to use state instead of controls

    addToQueue: useCallback((track: Track, source) => {
      // actions.addTrack(track, source) // Removed to avoid invalid use before declaration
      const queueItem: QueueItem = {
        id: `${track.id}-${Date.now()}`,
        track,
        source: source || {
          type: "single",
          id: track.id,
          name: track.title,
        },
        addedAt: new Date().toISOString(),
      }
      dispatch({ type: "ADD_ITEM", payload: queueItem })
    }, []), // Updated to use dispatch directly
  }

  const contextValue: QueueContextType = {
    state,
    controls,
    actions,
    currentTrack,
    audioRef,
  }

  return (
    <QueueContext.Provider value={contextValue}>
      {children}
      {/* Hidden audio element for playback */}
      <audio ref={audioRef} preload="metadata" />
    </QueueContext.Provider>
  )
}

export function useQueue() {
  const context = useContext(QueueContext)
  if (!context) {
    throw new Error("useQueue must be used within a QueueProvider")
  }
  return context
}
