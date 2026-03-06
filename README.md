# Aman Resorts — Luxury Hotel Web Application

A production-grade, fully dockerized luxury hotel web application featuring a premium dark-theme SPA frontend, RESTful API backend, and PostgreSQL database.

## Quick Start

```bash
docker compose up -d
```

Then open:

- **Website**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/pages/admin.html
- **API**: http://localhost:4000/api/health

**Admin Login**: `admin@amanresorts.com` / `AmanAdmin2024!`

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│                    (Browser @ :3000)                          │
└──────────┬──────────────────────────────────┬────────────────┘
           │ Static files                     │ /api/* requests
           ▼                                  ▼
┌──────────────────────┐    ┌──────────────────────────────────┐
│                      │    │                                  │
│   Nginx Frontend     │────│   reverse proxy: /api/* → :4000  │
│   (aman_frontend)    │    │                                  │
│   Port 80 → 3000     │    └──────────────┬───────────────────┘
│                      │                   │
│   Serves:            │                   ▼
│   - pages/index.html │    ┌──────────────────────────────────┐
│   - pages/admin.html │    │                                  │
│   - styles/*.css     │    │   Node.js + Express Backend      │
│   - js/*.js          │    │   (aman_backend)                 │
│   - public/*         │    │   Port 4000                      │
│                      │    │                                  │
└──────────────────────┘    │   - REST API controllers         │
                            │   - JWT authentication           │
                            │   - Input validation             │
                            │   - Rate limiting & CORS         │
                            │   - Helmet security headers      │
                            │                                  │
                            └──────────────┬───────────────────┘
                                           │
                                           ▼
                            ┌──────────────────────────────────┐
                            │                                  │
                            │   PostgreSQL 16 (Alpine)         │
                            │   (aman_database)                │
                            │   Port 5432 → 5433               │
                            │                                  │
                            │   - UUID primary keys            │
                            │   - Auto-updated timestamps      │
                            │   - Indexed for performance      │
                            │   - Seeded with luxury content   │
                            │                                  │
                            └──────────────────────────────────┘
```

### Request Flow

1. Browser requests `http://localhost:3000` — Nginx serves static HTML/CSS/JS
2. Frontend JavaScript makes API calls to `/api/*` (same origin)
3. Nginx proxies `/api/*` requests to the Node.js backend at `aman_backend:4000`
4. Backend queries PostgreSQL, applies business logic, returns JSON
5. Frontend renders data dynamically (with fallback data if backend is unreachable)

### Why This Architecture?

| Decision | Rationale |
|---|---|
| **Vanilla JS (no framework)** | Zero build step, instant Nginx serving, minimal bundle size, no framework churn |
| **Nginx as reverse proxy** | Single entry point for client, eliminates CORS in production, static file performance |
| **PostgreSQL with UUID PKs** | Production-ready relational DB, UUIDs prevent enumeration attacks |
| **bcryptjs for passwords** | Industry standard password hashing, pure JS (no native compilation needed in Alpine) |
| **JWT authentication** | Stateless auth, no session store needed, scales horizontally |
| **Fallback data in frontend** | Site renders beautifully even if backend is down — graceful degradation |

---

## Project Structure

```
hotel-AmanResorts/
├── docker-compose.yml          # Orchestrates all 3 services
├── .env.example                # Environment variable template
├── .gitignore
│
├── frontend/
│   ├── Dockerfile              # Nginx Alpine image
│   ├── nginx.conf              # Reverse proxy + static serving config
│   └── src/
│       ├── pages/
│       │   ├── index.html      # Main SPA (all sections)
│       │   └── admin.html      # Admin dashboard
│       ├── styles/
│       │   ├── variables.css   # Design tokens (colors, fonts, spacing)
│       │   ├── base.css        # Reset, typography, global styles
│       │   ├── components.css  # Buttons, cards, forms, modals
│       │   ├── layout.css      # Header, footer, grid systems
│       │   ├── pages.css       # Section-specific styles
│       │   ├── animations.css  # Scroll reveals, transitions, effects
│       │   └── responsive.css  # Mobile, tablet, desktop breakpoints
│       └── js/
│           ├── api.js          # API client with error handling
│           └── app.js          # SPA logic, navigation, components
│
├── backend/
│   ├── Dockerfile              # Node 20 Alpine, multi-stage build
│   ├── package.json
│   └── src/
│       ├── server.js           # Express app entry point
│       ├── config/
│       │   └── database.js     # PostgreSQL connection pool
│       ├── controllers/        # Request handlers
│       │   ├── roomController.js
│       │   ├── bookingController.js
│       │   ├── galleryController.js
│       │   ├── serviceController.js
│       │   ├── testimonialController.js
│       │   ├── contactController.js
│       │   ├── authController.js
│       │   └── adminController.js
│       ├── models/             # Database queries
│       │   ├── Room.js
│       │   ├── Booking.js
│       │   ├── Gallery.js
│       │   ├── Service.js
│       │   ├── Testimonial.js
│       │   ├── Contact.js
│       │   └── User.js
│       ├── routes/             # Express route definitions
│       │   ├── rooms.js
│       │   ├── bookings.js
│       │   ├── gallery.js
│       │   ├── services.js
│       │   ├── testimonials.js
│       │   ├── contact.js
│       │   ├── auth.js
│       │   └── admin.js
│       └── middleware/
│           ├── auth.js         # JWT verification
│           ├── validate.js     # express-validator rules
│           ├── errorHandler.js # Centralized error handler
│           └── notFound.js     # 404 catch-all
│
└── database/
    ├── schema.sql              # Table definitions, indexes, triggers
    └── seed.sql                # 6 rooms, 12 gallery, 6 services, 5 testimonials, 1 admin
```

---

## API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Service health check |
| GET | `/api/rooms` | List all rooms (filterable by category) |
| GET | `/api/rooms/:id` | Single room details |
| GET | `/api/rooms/availability` | Check room availability by date range |
| POST | `/api/bookings` | Create a booking |
| GET | `/api/gallery` | Gallery images (filterable by category) |
| GET | `/api/services` | Hotel services |
| GET | `/api/testimonials` | Guest testimonials |
| POST | `/api/contact` | Submit contact form |

### Authenticated (JWT required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login, returns JWT |
| GET | `/api/auth/profile` | Current user profile |
| GET | `/api/admin/dashboard` | Dashboard statistics |
| GET | `/api/admin/bookings` | All bookings with filters |
| PATCH | `/api/admin/bookings/:id` | Update booking status |
| GET | `/api/admin/messages` | Contact form submissions |

---

## Frontend Features

### Design System
- **Color palette**: Gold (#c9a34e) accent on dark (#0a0a0a) backgrounds
- **Typography**: Playfair Display (headings), Cormorant Garamond (subheadings), Inter (body)
- **Theme toggle**: Dark/light mode with smooth transitions

### SPA Sections
- **Hero**: Full-screen image slideshow with parallax effect
- **About**: Split layout with philosophy text and imagery
- **Rooms**: Filterable card grid with detail modals and booking links
- **Services**: Icon-driven feature cards with descriptions
- **Gallery**: Masonry-style grid with lightbox viewer and category filters
- **Testimonials**: Carousel with ratings, guest details, and stay info
- **Booking**: Multi-field form with real-time price calculator
- **Contact**: Form with validation, map placeholder, and social links

### Interactions
- Scroll-reveal animations (IntersectionObserver)
- Smooth section navigation with active state tracking
- Custom cursor on desktop
- Glassmorphism effects on navigation
- Stagger animations on card grids
- Preloader with branded animation

---

## Database Schema

### Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `rooms` | Accommodation listings | name, category, price, amenities (array), images (array), rating |
| `bookings` | Reservation records | room_id (FK), guest info, dates, total_price, status |
| `users` | Admin accounts | email, password_hash (bcrypt), role |
| `gallery` | Photo gallery items | title, image_url, category |
| `services` | Hotel services | name, description, icon, category, price |
| `testimonials` | Guest reviews | guest_name, rating, content, room_category |
| `contact_messages` | Inquiries | name, email, subject, message, is_read |

All tables use UUID primary keys and have `created_at`/`updated_at` timestamps with auto-update triggers.

---

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and customize:

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_PASSWORD` | `AmanSecure2024!` | PostgreSQL password |
| `JWT_SECRET` | `aman-jwt-secret-2024-production` | JWT signing secret |

### Port Mapping

| Service | Container Port | Host Port |
|---------|---------------|-----------|
| Frontend (Nginx) | 80 | 3000 |
| Backend (Node.js) | 4000 | 4000 |
| Database (PostgreSQL) | 5432 | 5433 |

---

## Development

### Rebuild after code changes

```bash
docker compose up -d --build
```

### View logs

```bash
docker compose logs -f              # All services
docker compose logs -f backend      # Backend only
```

### Access the database directly

```bash
docker exec -it aman_database psql -U aman_admin -d aman_resorts
```

### Reset database (destroy and recreate)

```bash
docker compose down -v
docker compose up -d
```

### Stop all services

```bash
docker compose down
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3 (custom properties), Vanilla JavaScript |
| Backend | Node.js 20, Express 4, bcryptjs, jsonwebtoken, express-validator |
| Database | PostgreSQL 16 (Alpine) |
| Proxy | Nginx (Alpine) |
| Containerization | Docker, Docker Compose |

---

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT-based stateless authentication
- Helmet.js security headers
- Rate limiting on all endpoints
- CORS configured for frontend origin only
- Input validation and sanitization on all POST endpoints
- SQL injection prevention via parameterized queries
- No secrets in codebase (environment variables)
