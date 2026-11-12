# StoryWorld (ស្វែងរកពិភពរឿង • រីករាយនឹងការអាន)
> Full-Stack Khmer Online Reading Platform

StoryWorld is a modern, responsive, and distraction-free online reading platform specifically crafted for Khmer literature, folktales, short stories, and novels. Built with clean architecture, robust role-based access control, PostgreSQL + Prisma ORM, and an editorial design system.

---

## 🌟 Key Features

### 📖 Reader Experience
- **Khmer Typography Optimization**: High-readability fonts (`Hanuman` & `Battambang`) paired with clean modern Latin fonts (`Inter` & `Poppins`).
- **Distraction-Free Chapter Reader**:
  - Three Reading Themes: **Light** (ធម្មតា), **Sepia** (សេពា), and **Dark** (ងងឹត).
  - Dynamic Font Size Adjustment (14px – 28px).
  - Adjustable Line Height (ធម្មតា, ស្រួលភ្នែក, ទូលាយ).
  - Configurable Content Width (តូច, មធ្យម, ធំទូលាយ).
  - Sticky Reading Progress indicator (%) with automatic backend progress synchronization on scroll.
  - Previous / Next chapter quick navigation and chapters drawer.
- **My Library & Reading History**:
  - One-click Story Bookmarking.
  - Automatic progress resume (Continue Reading from last read chapter).
  - Reading history tracker with timestamps and percentages.
- **Community Engagement**:
  - 1–5 Star Rating system.
  - Chapter and story comment threads with user avatars.
  - Social share with instant URL copying.

### 🛡️ Admin Dashboard (`/admin`)
- **Dashboard Overview**: Real-time counters for Stories, Chapters, Users, Categories, and Total Views.
- **Story Management**: Create, edit, draft/publish, assign categories, and upload book covers.
- **Chapter Management**: Add, update, and order chapters with full Khmer content editor.
- **Category Management**: Create, edit, and delete story categories with story count safeguards.
- **User Moderation**: View all registered users and safely activate or suspend accounts.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **Routing & State** | React Router v7, Zustand, TanStack Query v5 |
| **Icons & Forms** | Lucide React, Axios, React Hook Form, Zod |
| **Backend** | Node.js, Express.js, TypeScript, RESTful API |
| **Database & ORM** | PostgreSQL 18, Prisma ORM v5 |
| **Auth & Security** | JWT (jsonwebtoken), bcryptjs, CORS, Zod validation |
| **File Storage** | Multer local upload `/uploads` + Cloudinary compatible |

---

## 📁 Project Architecture

```
NovelWorld/
├── client/                     # Frontend Application (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/         # Reusable UI & Reader controls
│   │   │   ├── common/         # Navbar, Footer, LoadingSpinner, EmptyState
│   │   │   ├── reader/         # ReaderControls, ReaderFooter
│   │   │   └── stories/        # StoryCard, StoryGrid
│   │   ├── layouts/            # MainLayout, AdminLayout
│   │   ├── pages/              # Public, User & Admin Pages
│   │   │   ├── Home.tsx
│   │   │   ├── Explore.tsx
│   │   │   ├── StoryDetail.tsx
│   │   │   ├── ChapterReader.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── MyLibrary.tsx
│   │   │   ├── ReadingHistory.tsx
│   │   │   ├── Profile.tsx
│   │   │   └── admin/          # Admin Dashboard, Stories, Chapters, Categories, Users
│   │   ├── services/           # Axios API services
│   │   ├── stores/             # Zustand (authStore, readerStore)
│   │   └── types/              # TypeScript definitions
│   └── vite.config.ts
│
├── server/                     # Backend Application (Express + Prisma + TS)
│   ├── prisma/
│   │   ├── schema.prisma       # Relational database schema
│   │   └── seed.ts             # 8 Khmer sample stories, chapters & users
│   ├── src/
│   │   ├── config/             # Prisma client & settings
│   │   ├── controllers/        # Request handlers (auth, stories, admin, reader)
│   │   ├── middleware/         # Auth JWT, Admin verification, Multer, Zod
│   │   ├── routes/             # RESTful API endpoints (/api/v1)
│   │   ├── validators/         # Zod validation schemas
│   │   └── server.ts           # Server bootstrap
│   └── tsconfig.json
│
├── package.json                # Monorepo runner scripts
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v24.14.1)
- **PostgreSQL** running locally or a cloud database URL (e.g., Supabase / Neon / Render Postgres)

### 2. Database Setup
Make sure PostgreSQL is running and create the database `storyworld_db`:
```bash
# Example with psql:
psql -U postgres -c "CREATE DATABASE storyworld_db;"
```

### 3. Environment Variables

Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
DATABASE_URL="postgresql://postgres:sey123@localhost:5432/storyworld_db?schema=public"
JWT_SECRET="storyworld_super_secret_jwt_key_2026_khmer_reading_platform"
JWT_EXPIRES_IN="7d"
```

Create `client/.env`:
```env
VITE_API_URL=/api/v1
```

### 4. Install Dependencies & Seed Database
```bash
# Install root, backend, and frontend dependencies
npm run install:all

# Push schema and generate Prisma client
npm run prisma:push --prefix server

# Seed sample Khmer stories, categories, and users
npm run prisma:seed --prefix server
```

### 5. Run the Application
Run both server (port 5000) and client (port 3000) concurrently:
```bash
npm run dev
```

Visit the application in your browser:
- **StoryWorld Web**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

---

## 🔑 Default Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **Administrator** | `admin@storyworld.kh` | `password123` | Full access to `/admin` dashboard |
| **Reader User** | `reader@storyworld.kh` | `password123` | Browsing, bookmarks, reading history |

---

## 📡 RESTful API Reference (`/api/v1`)

### Authentication
- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login & receive JWT token
- `GET /auth/me` — Get current logged-in user details
- `POST /auth/logout` — Logout user session

### Public Stories & Reader
- `GET /stories` — List stories (filters: `search`, `category`, `sort`, `page`, `limit`)
- `GET /stories/:slug` — Retrieve story details, chapter list, views increment
- `GET /chapters/:id` — Read chapter content with previous and next links
- `GET /categories` — List all categories with published story counts
- `GET /stories/:id/comments` — Get comments for a story
- `POST /stories/:id/comments` — Add comment *(Auth required)*
- `POST /stories/:id/ratings` — Submit 1–5 star rating *(Auth required)*

### User Library & History
- `GET /users/bookmarks` — Retrieve user bookmarks *(Auth required)*
- `POST /users/bookmarks` — Add story bookmark *(Auth required)*
- `DELETE /users/bookmarks/:storyId` — Remove bookmark *(Auth required)*
- `GET /users/history` — Get user reading history & progress *(Auth required)*
- `PUT /users/history` — Update chapter reading percentage *(Auth required)*
- `PUT /users/profile` — Update user name, avatar, or password *(Auth required)*

### Admin Management (`/admin`) *(Admin Role Required)*
- `GET /admin/dashboard` — Platform statistics (stories, chapters, users, categories, views)
- `GET /admin/stories` — All stories (including drafts)
- `POST /admin/stories` — Create new story with cover image
- `PUT /admin/stories/:id` — Update existing story
- `DELETE /admin/stories/:id` — Delete story (cascades chapters & bookmarks)
- `POST /admin/chapters` — Add chapter to story
- `PUT /admin/chapters/:id` — Update chapter content or number
- `DELETE /admin/chapters/:id` — Delete chapter
- `GET /admin/categories` — Category list
- `POST /admin/categories` — Add category
- `PUT /admin/categories/:id` — Update category
- `DELETE /admin/categories/:id` — Delete category (prevented if stories exist)
- `GET /admin/users` — Paginated user directory
- `PUT /admin/users/:id/status` — Activate / Deactivate user account
- `DELETE /comments/:id` — Moderate / remove comment

---

## 🚢 Deployment Guide

### Frontend (Vercel)
1. Import repository on [Vercel](https://vercel.com).
2. Set **Root Directory** to `client`.
3. Set **Framework Preset** to `Vite`.
4. Configure Environment Variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://storyworld-api.onrender.com/api/v1`).
5. Deploy!

### Backend (Render)
1. Create a new **Web Service** on [Render](https://render.com).
2. Set **Root Directory** to `server`.
3. Set **Build Command**: `npm install && npm run build`
4. Set **Start Command**: `npm run start`
5. Configure Environment Variables:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: Your production PostgreSQL connection string.
   - `JWT_SECRET`: A secure 32+ character random secret string.
   - `CLIENT_URL`: Your Vercel frontend URL (e.g. `https://storyworld.vercel.app`).
6. Run `npm run prisma:push && npm run prisma:seed` in Render Shell.

---

## 🎨 Design System Tokens

```css
Primary Color:       #6C55D9 (StoryWorld Royal Purple)
Primary Hover:       #5841C5
Soft Purple:         #E9E5FA
Background:          #FFFFFF
Secondary Muted:     #F7F5F1
Main Text:           #242424
Secondary Text:      #777777
Border:              #EAEAEA

Reader Sepia:        #F4ECD8 (Bg) / #433422 (Text)
Reader Dark:         #121214 (Bg) / #E4E4E7 (Text)

Typography:
- Khmer: Battambang, Hanuman
- Latin: Inter, Poppins
```

---

## 📄 License
This project is open-source under the MIT License.
