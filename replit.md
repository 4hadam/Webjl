# IPTV Globe

## Overview

IPTV Globe is a web application that allows users to explore and watch live TV channels from countries around the world through an interactive 3D globe interface. The application features a React frontend with a 3D globe visualization, video streaming capabilities supporting HLS streams and YouTube embeds, and an Express backend that provides channel data and stream proxying.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, bundled using Vite
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state, React useState for local state
- **UI Components**: shadcn/ui component library built on Radix UI primitives with Tailwind CSS
- **3D Visualization**: globe.gl library with Three.js for the interactive globe
- **Video Playback**: Video.js with @videojs/http-streaming for HLS streams, react-youtube for YouTube embeds
- **Styling**: Tailwind CSS with CSS variables for theming, dark mode by default

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Build Tool**: esbuild for server bundling, Vite for client
- **API Design**: RESTful endpoints under `/api/` prefix
- **Key Endpoints**:
  - `/api/proxy` - Proxies video streams to handle CORS issues
  - Channel data served from shared IPTV channels module

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` defines database tables
- **Current Schema**: Basic users table with id, username, password
- **In-Memory Fallback**: MemStorage class for development without database

### Project Structure
- `client/` - React frontend application
  - `src/components/` - React components including UI primitives
  - `src/pages/` - Page components (home, not-found)
  - `src/hooks/` - Custom React hooks
  - `src/lib/` - Utility functions and query client
- `server/` - Express backend
  - `index.ts` - Server entry point
  - `routes.ts` - API route definitions
  - `storage.ts` - Data storage abstraction
  - `vite.ts` - Vite dev server integration
- `shared/` - Code shared between frontend and backend
  - `schema.ts` - Drizzle database schema
  - `iptv-channels.ts` - Channel data and category filtering
  - `country-codes.ts` - Country code mappings for flags
- `nextjs-app/` - Alternative Next.js implementation (for Vercel deployment)

### Key Design Patterns
- **Monorepo Structure**: Single repository with client, server, and shared code
- **Path Aliases**: `@/` maps to client/src, `@shared/` maps to shared/
- **Component Architecture**: Radix UI primitives wrapped with shadcn/ui styling
- **Smart Category Filtering**: Keyword-based channel categorization system in iptv-channels.ts

## External Dependencies

### Third-Party Services
- **Video Streaming**: HLS streams from various IPTV sources, YouTube embeds
- **Geographic Data**: GeoJSON country boundaries for globe visualization
- **Fonts**: Google Fonts (Geist, DM Sans, Fira Code, Inter)
- **Flag Icons**: Country flag images from flagcdn.com and cdn.jsdelivr.net

### Database
- **PostgreSQL**: Required for production, connection via DATABASE_URL environment variable
- **Drizzle Kit**: Database migrations and schema management (`npm run db:push`)

### Key NPM Packages
- `globe.gl` / `three` - 3D globe rendering
- `video.js` / `@videojs/http-streaming` - Video playback with HLS support
- `react-youtube` - YouTube embed integration
- `@turf/turf` - Geospatial analysis utilities
- `drizzle-orm` / `drizzle-zod` - Database ORM and validation
- `express-session` / `connect-pg-simple` - Session management
- Radix UI component primitives for accessible UI components