-- ============================================================
-- AMAN RESORTS - Seed Data
-- Luxury Hotel Sample Content
-- ============================================================

-- ────────────────────────────────────────────────
-- ROOMS
-- ────────────────────────────────────────────────
INSERT INTO rooms (name, slug, category, description, short_desc, price_per_night, max_guests, size_sqm, bed_type, view_type, rating, amenities, images, thumbnail, is_featured, sort_order) VALUES

('Ocean Pavilion Suite', 'ocean-pavilion-suite', 'pavilion',
 'Perched above the turquoise waters, the Ocean Pavilion Suite offers an uninterrupted panorama of the Indian Ocean. Floor-to-ceiling glass walls dissolve the boundary between interior luxury and the vast seascape. A private infinity plunge pool cascades toward the horizon, while the open-air living area is designed for quiet contemplation at sunset. Every detail — from the hand-carved teak furnishings to the organic cotton linens — has been curated for an experience of total serenity.',
 'Panoramic ocean views with private infinity plunge pool and open-air living.',
 1250.00, 2, 185, 'King', 'Ocean', 4.9,
 ARRAY['Private Pool', 'Ocean View', 'Butler Service', 'Spa Bath', 'Mini Bar', 'Terrace', 'Nespresso Machine', 'Bose Sound System'],
 ARRAY['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200'],
 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
 TRUE, 1),

('Imperial Garden Villa', 'imperial-garden-villa', 'villa',
 'Nestled within lush tropical gardens, the Imperial Garden Villa is a sanctuary of refined elegance. Spanning over 300 square meters, this private retreat features a master bedroom with handcrafted four-poster bed, a separate living pavilion, and a walled garden with heated pool. Traditional craftsmanship meets modern luxury in every corner — from the outdoor rain shower surrounded by frangipani to the private dining sala lit by lanterns.',
 'Secluded tropical villa with private garden, heated pool, and dining pavilion.',
 2800.00, 4, 320, 'King + Twin', 'Garden', 5.0,
 ARRAY['Private Pool', 'Garden', 'Butler Service', 'Kitchen', 'Outdoor Shower', 'Dining Pavilion', 'Library', 'Yoga Deck'],
 ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200'],
 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
 TRUE, 2),

('Cliff Edge Retreat', 'cliff-edge-retreat', 'suite',
 'Carved into the dramatic volcanic cliffside, this extraordinary retreat offers a perspective found nowhere else. Wake to the sound of waves breaking below as morning light floods through the panoramic windows. The double-height living space, the cantilevered terrace with glass floor panels, and the cliff-edge infinity pool create an experience that is as thrilling as it is luxurious. Interiors blend raw stone with brushed brass and Italian marble.',
 'Dramatic cliffside suite with cantilevered terrace and infinity pool.',
 1800.00, 2, 210, 'King', 'Cliff & Ocean', 4.8,
 ARRAY['Infinity Pool', 'Cliff View', 'Butler Service', 'Rain Shower', 'Fireplace', 'Telescope', 'Wine Cellar', 'Private Helipad Access'],
 ARRAY['https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1200', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200'],
 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800',
 TRUE, 3),

('Zen Mountain Lodge', 'zen-mountain-lodge', 'lodge',
 'High above the valley floor, the Zen Mountain Lodge draws inspiration from ancient Japanese minimalism. Clean lines, natural materials, and an absence of excess define this meditative space. The sunken living area frames a perfect view of mist-shrouded peaks, while the onsen-style private hot spring on the deck invites quiet restoration. A curated library of poetry and philosophy completes the atmosphere of refined contemplation.',
 'Minimalist mountain lodge with private onsen and valley views.',
 950.00, 2, 140, 'King', 'Mountain', 4.7,
 ARRAY['Private Onsen', 'Mountain View', 'Meditation Room', 'Tea Ceremony Set', 'Heated Floors', 'Library', 'Organic Minibar'],
 ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200'],
 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
 FALSE, 4),

('Royal Penthouse', 'royal-penthouse', 'penthouse',
 'The crown jewel of Aman Resorts, the Royal Penthouse occupies the entire top floor with 360-degree views that sweep from ocean to mountains. This 450-square-meter masterpiece features three bedrooms, a grand salon, a private cinema, a rooftop terrace with pool and bar, and a dedicated spa treatment room. Museum-quality art adorns the walls, and a personal team of butler, chef, and concierge ensures every moment is extraordinary.',
 'Top-floor penthouse with 360-degree views, private cinema, and rooftop pool.',
 5500.00, 6, 450, 'King + 2 Queen', 'Panoramic', 5.0,
 ARRAY['Rooftop Pool', 'Private Cinema', 'Personal Chef', 'Spa Room', 'Wine Cellar', 'Helicopter Transfer', 'Art Collection', 'Grand Piano'],
 ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200'],
 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
 TRUE, 5),

('Tropical Overwater Bungalow', 'tropical-overwater-bungalow', 'bungalow',
 'Suspended above a crystalline lagoon, the Overwater Bungalow redefines island luxury. Glass floor panels reveal the marine life beneath, while the expansive sundeck with direct lagoon access invites spontaneous swims. The interior is a celebration of organic textures — driftwood, woven rattan, and sun-bleached linen — creating a space that feels both luxurious and deeply connected to the natural world.',
 'Overwater bungalow with glass floors, lagoon access, and organic interiors.',
 1600.00, 2, 165, 'King', 'Lagoon', 4.9,
 ARRAY['Glass Floor', 'Lagoon Access', 'Sundeck', 'Outdoor Shower', 'Snorkeling Gear', 'Kayak', 'Sunset Bar', 'Butler Service'],
 ARRAY['https://images.unsplash.com/photo-1439130490301-25e322d88054?w=1200', 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200', 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200'],
 'https://images.unsplash.com/photo-1439130490301-25e322d88054?w=800',
 TRUE, 6);

-- ────────────────────────────────────────────────
-- GALLERY
-- ────────────────────────────────────────────────
INSERT INTO gallery (title, description, image_url, category, sort_order) VALUES
('The Grand Arrival', 'A first impression that takes your breath away', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', 'exterior', 1),
('Infinity Edge', 'Where the pool meets the horizon', 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200', 'pool', 2),
('Ocean Pavilion at Dusk', 'Golden hour in our signature suite', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200', 'rooms', 3),
('The Spa Sanctuary', 'Ancient healing traditions in a modern setting', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200', 'spa', 4),
('Garden Dining', 'Farm-to-table under the stars', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200', 'dining', 5),
('Cliffside Morning', 'Awakening above the clouds', 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1200', 'exterior', 6),
('The Library Bar', 'Rare vintages in an intimate setting', 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200', 'dining', 7),
('Overwater Serenity', 'Life above the turquoise lagoon', 'https://images.unsplash.com/photo-1439130490301-25e322d88054?w=1200', 'rooms', 8),
('Yoga at Dawn', 'Begin the day with intention', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200', 'wellness', 9),
('Mountain Mist', 'Where earth meets sky', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200', 'exterior', 10),
('Private Beach', 'Your own stretch of paradise', 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200', 'exterior', 11),
('The Grand Salon', 'Curated elegance in every detail', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200', 'rooms', 12);

-- ────────────────────────────────────────────────
-- SERVICES
-- ────────────────────────────────────────────────
INSERT INTO services (name, slug, description, short_desc, icon, image_url, category, price, is_featured, sort_order) VALUES

('Aman Spa & Wellness', 'spa-wellness', 
 'Our holistic spa philosophy draws from centuries of healing traditions. Each treatment begins with a consultation to create a bespoke wellness journey. From traditional Balinese massage to advanced cryotherapy, our therapists are masters of restoration. The thermal suite includes a Finnish sauna, ice fountain, vitality pool, and crystal steam room.',
 'Holistic treatments inspired by ancient healing traditions.',
 'spa', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200',
 'wellness', 'From $250', TRUE, 1),

('Private Fine Dining', 'fine-dining',
 'Our culinary program is led by a team of internationally acclaimed chefs who source ingredients from our organic gardens, local fishermen, and artisan producers. Experience a private multi-course tasting menu in locations ranging from a candlelit beach to a cliff-edge pavilion. Each meal is a narrative, each dish a chapter in an unforgettable story.',
 'Michelin-caliber cuisine in extraordinary private settings.',
 'dining', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
 'dining', 'From $180 pp', TRUE, 2),

('Ocean Expeditions', 'ocean-expeditions',
 'Explore the marine world with our team of marine biologists and master divers. From dawn snorkeling with manta rays to sunset sailing on a traditional wooden vessel, every expedition is crafted to create a profound connection with the ocean. Private submarine tours and deep-sea fishing with our captain are available on request.',
 'Curated marine adventures with expert naturalists.',
 'ocean', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200',
 'adventure', 'From $400', TRUE, 3),

('Helicopter & Yacht Transfers', 'luxury-transfers',
 'Arrive in a manner befitting the destination. Our fleet includes a Bell 429 helicopter for scenic aerial transfers and a 65-foot custom yacht for leisurely ocean arrivals. Both are available for private excursions — island-hopping, aerial photography tours, or sunset champagne cruises along the coastline.',
 'Scenic arrivals by private helicopter or luxury yacht.',
 'transport', 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1200',
 'transport', 'From $1,200', FALSE, 4),

('Wellness & Yoga Retreats', 'yoga-retreats',
 'Our resident yoga masters and wellness practitioners guide transformative multi-day retreats tailored to your intentions. Practice on cliff-edge platforms at sunrise, learn pranayama breathing in mountain meditation caves, and nourish your body with Ayurvedic cuisine. Programs range from weekend intensives to 21-day transformative journeys.',
 'Transformative retreats with master practitioners.',
 'yoga', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200',
 'wellness', 'From $350/day', TRUE, 5),

('Cultural Immersion', 'cultural-immersion',
 'Aman Resorts sits at the crossroads of rich cultural heritage. Our curated experiences include private temple ceremonies, traditional cooking classes with village elders, artisan workshops in batik and woodcarving, and guided explorations of ancient ruins with our resident archaeologist. Each experience is designed to foster genuine connection and understanding.',
 'Authentic encounters with local traditions and artisans.',
 'culture', 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1200',
 'cultural', 'From $200', FALSE, 6);

-- ────────────────────────────────────────────────
-- TESTIMONIALS
-- ────────────────────────────────────────────────
INSERT INTO testimonials (guest_name, guest_location, rating, title, content, stay_date, room_category, is_featured) VALUES

('Victoria Harrington', 'London, United Kingdom', 5,
 'An experience beyond words',
 'In twenty years of traveling to the finest hotels in the world, nothing has come close to Aman Resorts. The Ocean Pavilion Suite was not simply a room — it was a private universe. The staff seemed to anticipate our every need before we were aware of it ourselves. On our last evening, they arranged a private dinner on the cliff edge with a string quartet. My husband and I wept. This is not a hotel. This is a place where time slows down and beauty reveals itself.',
 '2024-11-15', 'pavilion', TRUE),

('James & Sophia Rothwell', 'New York, USA', 5,
 'Our third visit — each one more magical',
 'We first came to Aman for our honeymoon. We returned for our fifth anniversary. Now, for our tenth, we brought our children. The Imperial Garden Villa gave us the space and privacy to be together as a family while still experiencing extraordinary luxury. The kids learned to make traditional offerings, snorkeled with marine biologists, and declared it the best holiday of their lives. We have already booked next year.',
 '2024-09-22', 'villa', TRUE),

('Hiroshi Tanaka', 'Tokyo, Japan', 5,
 'Wabi-sabi perfection',
 'As someone who values minimalism and intentional design, the Zen Mountain Lodge spoke to my soul. Every element was considered — the way morning light entered through the shoji screens, the temperature of the private onsen, the silence that felt not empty but full. I spent three days reading, soaking, and watching the mountain mist. I left feeling like a different person. The highest compliment I can give: it felt like home.',
 '2024-08-10', 'lodge', TRUE),

('Isabella Monteiro', 'Sao Paulo, Brazil', 5,
 'Healing in paradise',
 'I came to Aman Resorts after a difficult year, seeking restoration. The wellness retreat exceeded every expectation. My yoga instructor, Wayan, understood intuitively what I needed. The spa treatments were transformative, not just relaxing. By the end of my seven-day stay, I had a clarity and peace I had not felt in years. The staff treated me not as a guest but as family. I am deeply grateful.',
 '2024-07-05', 'suite', TRUE),

('Alexander & Nadia Volkov', 'Moscow, Russia', 5,
 'The only place we celebrate',
 'For the past four years, we have celebrated every milestone at Aman Resorts. The Royal Penthouse is our tradition for New Year — the rooftop pool under the stars, the private chef preparing our favorite dishes, the fireworks reflected in the infinity edge. It is not merely luxury. It is an emotional experience that reminds us what matters. The team remembers our preferences from years past. That level of care is irreplaceable.',
 '2024-12-31', 'penthouse', TRUE);

-- ────────────────────────────────────────────────
-- ADMIN USER (password: AmanAdmin2024!)
-- Hash generated with bcrypt rounds=12
-- ────────────────────────────────────────────────
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@amanresorts.com', '$2a$12$s.n.8aMbvd.aeb3fvt4Qw.XNxCXAngHSpPw8vp1wzq0v8pbAtHf.y', 'Aman Administrator', 'admin');
