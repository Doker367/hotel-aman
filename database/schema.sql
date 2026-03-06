-- ============================================================
-- AMAN RESORTS - Database Schema
-- Premium Luxury Hotel Management System
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────────
-- ROOMS
-- ────────────────────────────────────────────────
CREATE TABLE rooms (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(200) NOT NULL,
    slug            VARCHAR(200) UNIQUE NOT NULL,
    category        VARCHAR(100) NOT NULL DEFAULT 'suite',
    description     TEXT NOT NULL,
    short_desc      VARCHAR(500),
    price_per_night DECIMAL(10, 2) NOT NULL,
    max_guests      INTEGER NOT NULL DEFAULT 2,
    size_sqm        INTEGER,
    bed_type        VARCHAR(100),
    view_type       VARCHAR(100),
    rating          DECIMAL(2, 1) DEFAULT 4.8,
    amenities       TEXT[] DEFAULT '{}',
    images          TEXT[] DEFAULT '{}',
    thumbnail       VARCHAR(500),
    is_available    BOOLEAN DEFAULT TRUE,
    is_featured     BOOLEAN DEFAULT FALSE,
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- BOOKINGS
-- ────────────────────────────────────────────────
CREATE TABLE bookings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id         UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    guest_name      VARCHAR(200) NOT NULL,
    guest_email     VARCHAR(200) NOT NULL,
    guest_phone     VARCHAR(50),
    check_in        DATE NOT NULL,
    check_out       DATE NOT NULL,
    guests_count    INTEGER NOT NULL DEFAULT 1,
    special_requests TEXT,
    total_price     DECIMAL(10, 2) NOT NULL,
    status          VARCHAR(50) DEFAULT 'pending',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (check_out > check_in),
    CONSTRAINT valid_guests CHECK (guests_count > 0)
);

-- ────────────────────────────────────────────────
-- USERS (Admin)
-- ────────────────────────────────────────────────
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(200) UNIQUE NOT NULL,
    password_hash   VARCHAR(500) NOT NULL,
    full_name       VARCHAR(200) NOT NULL,
    role            VARCHAR(50) DEFAULT 'admin',
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- GALLERY
-- ────────────────────────────────────────────────
CREATE TABLE gallery (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    image_url       VARCHAR(500) NOT NULL,
    category        VARCHAR(100) DEFAULT 'general',
    sort_order      INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- SERVICES
-- ────────────────────────────────────────────────
CREATE TABLE services (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(200) NOT NULL,
    slug            VARCHAR(200) UNIQUE NOT NULL,
    description     TEXT NOT NULL,
    short_desc      VARCHAR(500),
    icon            VARCHAR(100),
    image_url       VARCHAR(500),
    category        VARCHAR(100) DEFAULT 'wellness',
    price           VARCHAR(100),
    is_featured     BOOLEAN DEFAULT FALSE,
    sort_order      INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- TESTIMONIALS
-- ────────────────────────────────────────────────
CREATE TABLE testimonials (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_name      VARCHAR(200) NOT NULL,
    guest_location  VARCHAR(200),
    avatar_url      VARCHAR(500),
    rating          INTEGER DEFAULT 5,
    title           VARCHAR(300),
    content         TEXT NOT NULL,
    stay_date       DATE,
    room_category   VARCHAR(100),
    is_featured     BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- CONTACT MESSAGES
-- ────────────────────────────────────────────────
CREATE TABLE contact_messages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(200) NOT NULL,
    email           VARCHAR(200) NOT NULL,
    phone           VARCHAR(50),
    subject         VARCHAR(300),
    message         TEXT NOT NULL,
    is_read         BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- INDEXES
-- ────────────────────────────────────────────────
CREATE INDEX idx_rooms_category ON rooms(category);
CREATE INDEX idx_rooms_available ON rooms(is_available);
CREATE INDEX idx_rooms_featured ON rooms(is_featured);
CREATE INDEX idx_bookings_room ON bookings(room_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX idx_gallery_category ON gallery(category);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_testimonials_featured ON testimonials(is_featured);

-- ────────────────────────────────────────────────
-- UPDATED_AT TRIGGER
-- ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rooms_updated_at
    BEFORE UPDATE ON rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
