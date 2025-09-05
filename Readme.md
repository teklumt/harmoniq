# Harmoniq - Music Streaming Service

<img width="1338" height="621" alt="image_2025-09-05_15-55-51" src="https://github.com/user-attachments/assets/6e858466-9399-485f-bfbf-0c574b1d2a56" />


## Project Overview

**Harmoniq** is a modern music streaming platform that allows users to discover, upload, and share music. Users can create playlists, save favorite tracks, and connect with artists. The platform features a global music queue, playlist management, and seamless playback experience.

---

## Features

- **Music Discovery:** Search for tracks, albums, and artists.
- **Upload Music:** Artists can upload their original tracks.
- **Favorites:** Save and manage favorite songs.
- **Playlists:** Create, edit, and organize playlists.
- **Music Queue:** Add tracks, albums, or playlists to a global queue.
- **Player:** Full-featured music player with shuffle, repeat, and volume controls.
- **Authentication:** Secure user login and registration.
- **Spotify Import:** Import playlists from Spotify (demo/placeholder).

---

## Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **Backend:** Next.js API routes, Prisma ORM
- **Database:** PostgreSQL (via Prisma)
- **Cloud Storage:** Cloudinary (for music uploads)
- **Authentication:** Custom (BetterAuth)
- **UI:** Tailwind CSS, Radix UI

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (recommended)
- PostgreSQL database

### Installation

```sh
pnpm install
```

### Environment Setup

Create a [`.env`](.env ) file based on `.env.example` and configure your database and Cloudinary credentials.

### Database Setup

```sh
pnpx prisma generate
pnpx prisma db push
```

### Running the App

```sh
pnpm run dev
```

### Formatting & Studio

```sh
pnpx prisma format
pnpx prisma studio
```

---

## Project Structure

```
app/                # Next.js pages and API routes
components/         # Reusable React components
contexts/           # React context providers (e.g., music queue)
hooks/              # Custom React hooks
lib/                # Utility libraries (auth, types, etc.)
prisma/             # Prisma schema and migrations
public/             # Static assets
styles/             # Global styles
utils/              # Utility functions
```

---

## Group Members

- **Teklu Moges**
- **Nejat Mohammed**
- **Diana Luel**
- **Yordanos Legesse**

---


## Demo Video: https://drive.google.com/file/d/1-mH3xuCMTljQ2L1TH5N8cpKBRjYFj4PH/view?usp=sharing

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Cloudinary](https://cloudinary.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

---

## Screenshots
<img width="1342" height="631" alt="image_2025-09-05_16-26-39" src="https://github.com/user-attachments/assets/e76d3e97-49e4-42b7-81af-545889dd6e04" />
<img width="1347" height="616" alt="image_2025-09-05_16-28-33" src="https://github.com/user-attachments/assets/3f68130c-a83e-4729-88a5-109e3177a1bb" />
<img width="1349" height="627" alt="image_2025-09-05_16-29-04" src="https://github.com/user-attachments/assets/cdeb52d3-81b2-43ed-bff2-379ac35d4a80" />


## Contact

For questions or feedback, please contact any of the group members.

---

**Enjoy streaming with Harmoniq!**
