export interface Track {
  id: string
  title: string
  artist: string
  album?: string
  duration: number // in seconds
  mp3Url: string // Required for streaming
  coverArt?: string
  genre?: string
  releaseDate?: string
  trackNumber?: number
  isExplicit?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Album {
  id: string
  title: string
  artist: string
  coverArt?: string
  releaseDate?: string
  genre?: string
  description?: string
  tracks: Track[]
  totalDuration: number // calculated from tracks
  trackCount: number // calculated from tracks
  createdAt?: string
  updatedAt?: string
}

export interface Playlist {
  id: string
  name: string
  description?: string
  coverArt?: string
  isPublic: boolean
  createdBy: string // user ID
  tracks: Track[]
  totalDuration: number // calculated from tracks
  trackCount: number // calculated from tracks
  createdAt: string
  updatedAt: string
}

export interface QueueItem {
  id: string
  track: Track
  source: {
    type: "single" | "album" | "playlist"
    id: string
    name: string
  }
  addedAt: string
}

export interface QueueState {
  items: QueueItem[]
  currentIndex: number
  isPlaying: boolean
  isPaused: boolean
  isShuffled: boolean
  repeatMode: "none" | "one" | "all"
  volume: number // 0-1
  currentTime: number // in seconds
  duration: number // in seconds
}

export interface PlayerControls {
  play: () => void
  pause: () => void
  stop: () => void
  next: () => void
  previous: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  toggleShuffle: () => void
  toggleRepeat: () => void
}

export interface QueueActions {
  addTrack: (track: Track, source?: QueueItem["source"]) => void
  addAlbum: (album: Album) => void
  addPlaylist: (playlist: Playlist) => void
  removeItem: (itemId: string) => void
  clearQueue: () => void
  moveItem: (fromIndex: number, toIndex: number) => void
  playFromIndex: (index: number) => void
  playNext: (track: Track, source?: QueueItem["source"]) => void
  addToQueue: (track: Track, source?: QueueItem["source"]) => void
}

// Utility types for API responses
export interface MusicSearchResult {
  tracks: Track[]
  albums: Album[]
  playlists: Playlist[]
  totalResults: number
}

export interface UserLibrary {
  likedTracks: Track[]
  playlists: Playlist[]
  recentlyPlayed: Track[]
  followedArtists: string[]
}
