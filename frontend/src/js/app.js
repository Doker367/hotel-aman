/* ============================================================
   AMAN RESORTS - Main Application
   Vanilla JS SPA with premium interactions
   ============================================================ */

(() => {
  'use strict';

  // ── State ──────────────────────────────────────
  const state = {
    rooms: [],
    services: [],
    gallery: [],
    galleryCategories: [],
    testimonials: [],
    currentTestimonial: 0,
    currentHeroSlide: 0,
    heroInterval: null,
    roomPrices: {},
  };

  // ── DOM Cache ──────────────────────────────────
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ── Utility Functions ──────────────────────────
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const debounce = (fn, ms) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  };

  // ══════════════════════════════════════════════
  // INITIALIZATION
  // ══════════════════════════════════════════════
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initPreloader();
    initTheme();
    initNavigation();
    initHeroSlider();
    initCustomCursor();
    initScrollReveal();
    initSmoothScroll();
    loadAllData();
    initBookingForm();
    initContactForm();
    initDateDefaults();
  }

  // ── Preloader ──────────────────────────────────
  function initPreloader() {
    const preloader = $('#preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.classList.remove('no-scroll');
      }, 2200);
    });

    // Fallback: remove preloader after 4s no matter what
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.classList.remove('no-scroll');
    }, 4000);
  }

  // ── Theme Toggle ───────────────────────────────
  function initTheme() {
    const toggle = $('#themeToggle');
    const saved = localStorage.getItem('aman_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);

    if (toggle) {
      toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('aman_theme', next);
      });
    }
  }

  // ══════════════════════════════════════════════
  // NAVIGATION
  // ══════════════════════════════════════════════
  function initNavigation() {
    const navbar = $('#navbar');
    const hamburger = $('#hamburger');
    const mobileMenu = $('#mobileMenu');

    // Sticky nav
    const onScroll = () => {
      if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      updateActiveLink();
    };

    window.addEventListener('scroll', debounce(onScroll, 10), { passive: true });
    onScroll();

    // Hamburger
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
      });

      // Close menu on link click
      $$('.mobile-menu__link', mobileMenu).forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('active');
          document.body.classList.remove('no-scroll');
        });
      });
    }
  }

  function updateActiveLink() {
    const sections = $$('section[id]');
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        $$('.nav__link').forEach(l => l.classList.remove('active'));
        const activeLink = $(`.nav__link[data-section="${id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }

  // ══════════════════════════════════════════════
  // HERO SLIDER
  // ══════════════════════════════════════════════
  function initHeroSlider() {
    const slides = $$('.hero__slide');
    const dots = $$('.hero__slide-dot');
    if (slides.length === 0) return;

    function goToSlide(index) {
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      state.currentHeroSlide = index;
      slides[index].classList.add('active');
      if (dots[index]) dots[index].classList.add('active');
    }

    function nextSlide() {
      const next = (state.currentHeroSlide + 1) % slides.length;
      goToSlide(next);
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.slide, 10);
        goToSlide(idx);
        resetInterval();
      });
    });

    function resetInterval() {
      clearInterval(state.heroInterval);
      state.heroInterval = setInterval(nextSlide, 6000);
    }

    resetInterval();
  }

  // ══════════════════════════════════════════════
  // CUSTOM CURSOR
  // ══════════════════════════════════════════════
  function initCustomCursor() {
    if (window.matchMedia('(max-width: 1024px)').matches) return;
    if ('ontouchstart' in window) return;

    const dot = $('.cursor__dot');
    const ring = $('.cursor__ring');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    const interactives = 'a, button, .room-card, .gallery-item, .service-card, input, select, textarea';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactives)) {
        document.body.classList.add('cursor--hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactives)) {
        document.body.classList.remove('cursor--hover');
      }
    });
  }

  // ══════════════════════════════════════════════
  // SCROLL ANIMATIONS
  // ══════════════════════════════════════════════
  function initScrollReveal() {
    const revealElements = $$('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => observer.observe(el));

    // Counter animation for stats
    initCounterAnimation();
  }

  function initCounterAnimation() {
    const counters = $$('[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // ── Smooth Scrolling ───────────────────────────
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = link.getAttribute('href');
        if (target === '#') return;
        const el = $(target);
        if (el) {
          e.preventDefault();
          const offset = 80;
          const top = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  // ══════════════════════════════════════════════
  // DATA LOADING
  // ══════════════════════════════════════════════
  async function loadAllData() {
    // Load all data in parallel
    await Promise.allSettled([
      loadRooms(),
      loadServices(),
      loadGallery(),
      loadTestimonials()
    ]);

    // After data is loaded, trigger animations for grid items
    setTimeout(observeGridItems, 100);
  }

  async function loadRooms() {
    try {
      const res = await API.getRooms();
      state.rooms = res.data;
      renderRooms(state.rooms);
      populateBookingRoomSelect(state.rooms);
    } catch (err) {
      console.warn('[Rooms] API unavailable, using fallback data');
      state.rooms = getFallbackRooms();
      renderRooms(state.rooms);
      populateBookingRoomSelect(state.rooms);
    }
  }

  async function loadServices() {
    try {
      const res = await API.getServices();
      state.services = res.data;
      renderServices(state.services);
    } catch (err) {
      console.warn('[Services] API unavailable, using fallback data');
      state.services = getFallbackServices();
      renderServices(state.services);
    }
  }

  async function loadGallery() {
    try {
      const res = await API.getGallery();
      state.gallery = res.data;
      state.galleryCategories = res.categories || [];
      renderGallery(state.gallery);
      renderGalleryFilters(state.galleryCategories);
    } catch (err) {
      console.warn('[Gallery] API unavailable, using fallback data');
      state.gallery = getFallbackGallery();
      renderGallery(state.gallery);
    }
  }

  async function loadTestimonials() {
    try {
      const res = await API.getTestimonials(true);
      state.testimonials = res.data;
      renderTestimonials(state.testimonials);
    } catch (err) {
      console.warn('[Testimonials] API unavailable, using fallback data');
      state.testimonials = getFallbackTestimonials();
      renderTestimonials(state.testimonials);
    }
  }

  // ══════════════════════════════════════════════
  // RENDER FUNCTIONS
  // ══════════════════════════════════════════════

  // ── Rooms ──────────────────────────────────────
  function renderRooms(rooms) {
    const grid = $('#roomsGrid');
    if (!grid) return;

    grid.innerHTML = rooms.map(room => {
      state.roomPrices[room.id || room.slug] = room.price_per_night;
      return `
        <article class="room-card" data-category="${room.category}" data-room-id="${room.id || room.slug}">
          <div class="room-card__image">
            <img src="${room.thumbnail}" alt="${room.name}" loading="lazy">
            ${room.is_featured ? '<span class="room-card__badge">Featured</span>' : ''}
            <div class="room-card__rating">
              <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              ${room.rating}
            </div>
          </div>
          <div class="room-card__body">
            <div class="room-card__category">${room.category}</div>
            <h3 class="room-card__name">${room.name}</h3>
            <p class="room-card__desc">${room.short_desc || room.description}</p>
            <div class="room-card__meta">
              <span class="room-card__meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                ${room.size_sqm} m&sup2;
              </span>
              <span class="room-card__meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                Up to ${room.max_guests}
              </span>
              <span class="room-card__meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 4v16M22 4v16M6 20h12M6 4h12M6 12h12M2 12h4M18 12h4"/></svg>
                ${room.bed_type}
              </span>
            </div>
            <div class="room-card__footer">
              <div class="room-card__price">
                <span class="room-card__price-amount">${formatCurrency(room.price_per_night)}</span>
                <span class="room-card__price-unit">/ night</span>
              </div>
              <button class="room-card__cta" onclick="event.stopPropagation()">
                Reserve
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Room card click -> modal
    $$('.room-card', grid).forEach(card => {
      card.addEventListener('click', () => {
        const roomId = card.dataset.roomId;
        const room = state.rooms.find(r => (r.id || r.slug) === roomId);
        if (room) openRoomModal(room);
      });

      // Reserve button -> scroll to booking
      const cta = card.querySelector('.room-card__cta');
      if (cta) {
        cta.addEventListener('click', (e) => {
          e.stopPropagation();
          const roomId = card.dataset.roomId;
          const select = $('#bookingRoom');
          if (select) {
            // Try to select by UUID or slug
            const option = Array.from(select.options).find(
              o => o.value === roomId || o.dataset.slug === roomId
            );
            if (option) select.value = option.value;
            updateBookingSummary();
          }
          const bookingSection = $('#booking');
          if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }
    });

    // Room filter
    $$('.rooms__filter .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.rooms__filter .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        const filtered = filter === 'all'
          ? state.rooms
          : state.rooms.filter(r => r.category === filter);
        renderRooms(filtered);
        setTimeout(observeGridItems, 50);
      });
    });
  }

  function openRoomModal(room) {
    const modal = $('#roomModal');
    const body = $('#roomModalBody');
    if (!modal || !body) return;

    const amenities = (room.amenities || [])
      .map(a => `<span class="room-modal__amenity">${a}</span>`).join('');

    body.innerHTML = `
      <img class="room-modal__image" src="${room.thumbnail || (room.images && room.images[0])}" alt="${room.name}">
      <div class="room-modal__body">
        <div class="room-modal__category">${room.category} &middot; ${room.view_type} View</div>
        <h2 class="room-modal__title">${room.name}</h2>
        <p class="room-modal__desc">${room.description}</p>
        
        <div class="room-modal__details">
          <div class="room-modal__detail-item">
            <span class="room-modal__detail-label">Size</span>
            <span class="room-modal__detail-value">${room.size_sqm} m&sup2;</span>
          </div>
          <div class="room-modal__detail-item">
            <span class="room-modal__detail-label">Guests</span>
            <span class="room-modal__detail-value">Up to ${room.max_guests}</span>
          </div>
          <div class="room-modal__detail-item">
            <span class="room-modal__detail-label">Bed</span>
            <span class="room-modal__detail-value">${room.bed_type}</span>
          </div>
          <div class="room-modal__detail-item">
            <span class="room-modal__detail-label">Rating</span>
            <span class="room-modal__detail-value">${room.rating} / 5</span>
          </div>
        </div>

        <div class="room-modal__amenities">
          <h4>Amenities</h4>
          <div class="room-modal__amenity-list">${amenities}</div>
        </div>

        <div class="room-modal__cta">
          <div class="room-modal__price">
            <span class="room-modal__price-amount">${formatCurrency(room.price_per_night)}</span>
            <span class="room-modal__price-unit"> / night</span>
          </div>
          <a href="#booking" class="btn btn--primary" data-close-modal onclick="
            document.getElementById('roomModal').classList.remove('active');
            document.body.classList.remove('no-scroll');
          ">
            <span>Reserve Now</span>
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M5 12h14M12 5l7 7-7 7'/></svg>
          </a>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.classList.add('no-scroll');

    // Close handlers
    modal.querySelectorAll('[data-close-modal]').forEach(el => {
      el.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // ── Services ───────────────────────────────────
  function renderServices(services) {
    const grid = $('#servicesGrid');
    if (!grid) return;

    grid.innerHTML = services.map(svc => `
      <article class="service-card">
        <div class="service-card__image">
          <img src="${svc.image_url}" alt="${svc.name}" loading="lazy">
        </div>
        <div class="service-card__body">
          <div class="service-card__category">${svc.category}</div>
          <h3 class="service-card__name">${svc.name}</h3>
          <p class="service-card__desc">${svc.short_desc || svc.description}</p>
          <div class="service-card__footer">
            <span class="service-card__price">${svc.price || ''}</span>
            <a href="#contact" class="btn btn--ghost" style="padding:0.5rem 1rem;font-size:0.75rem;">Inquire</a>
          </div>
        </div>
      </article>
    `).join('');
  }

  // ── Gallery ────────────────────────────────────
  function renderGallery(items) {
    const grid = $('#galleryGrid');
    if (!grid) return;

    grid.innerHTML = items.map((img, i) => `
      <div class="gallery-item" data-category="${img.category}" data-index="${i}">
        <img src="${img.image_url}" alt="${img.title}" loading="lazy">
        <div class="gallery-item__overlay">
          <div class="gallery-item__info">
            <h4>${img.title}</h4>
            <p>${img.description || ''}</p>
          </div>
        </div>
      </div>
    `).join('');

    // Lightbox
    $$('.gallery-item', grid).forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index, 10);
        openLightbox(index);
      });
    });
  }

  function renderGalleryFilters(categories) {
    const filterContainer = $('#galleryFilter');
    if (!filterContainer || categories.length === 0) return;

    const existing = filterContainer.querySelectorAll('.filter-btn:not([data-filter="all"])');
    existing.forEach(el => el.remove());

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.dataset.filter = cat;
      btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      filterContainer.appendChild(btn);
    });

    $$('.filter-btn', filterContainer).forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.filter-btn', filterContainer).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        const filtered = filter === 'all'
          ? state.gallery
          : state.gallery.filter(img => img.category === filter);
        renderGallery(filtered);
        setTimeout(observeGridItems, 50);
      });
    });
  }

  // ── Lightbox ───────────────────────────────────
  function openLightbox(index) {
    const lightbox = $('#lightbox');
    const img = $('#lightboxImg');
    const caption = $('#lightboxCaption');
    if (!lightbox || !img) return;

    let current = index;
    const items = state.gallery;

    function show(i) {
      current = i;
      img.src = items[i].image_url;
      img.alt = items[i].title;
      if (caption) caption.textContent = `${items[i].title} — ${items[i].description || ''}`;
    }

    show(current);
    lightbox.classList.add('active');
    document.body.classList.add('no-scroll');

    const close = () => {
      lightbox.classList.remove('active');
      document.body.classList.remove('no-scroll');
    };

    $('#lightboxClose').onclick = close;
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) close();
    });

    $('#lightboxPrev').onclick = (e) => {
      e.stopPropagation();
      show((current - 1 + items.length) % items.length);
    };
    $('#lightboxNext').onclick = (e) => {
      e.stopPropagation();
      show((current + 1) % items.length);
    };

    // Keyboard navigation
    const handleKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show((current - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') show((current + 1) % items.length);
    };
    document.addEventListener('keydown', handleKey);

    // Cleanup on close
    const observer = new MutationObserver(() => {
      if (!lightbox.classList.contains('active')) {
        document.removeEventListener('keydown', handleKey);
        observer.disconnect();
      }
    });
    observer.observe(lightbox, { attributes: true, attributeFilter: ['class'] });
  }

  // ── Testimonials ───────────────────────────────
  function renderTestimonials(testimonials) {
    const carousel = $('#testimonialsCarousel');
    const dotsContainer = $('#testimDots');
    if (!carousel) return;

    carousel.innerHTML = testimonials.map(t => {
      const stars = Array(t.rating).fill(
        `<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
      ).join('');

      return `
        <div class="testimonial-card">
          <div class="testimonial-card__stars">${stars}</div>
          <h3 class="testimonial-card__title">"${t.title}"</h3>
          <p class="testimonial-card__content">${t.content}</p>
          <div class="testimonial-card__author">${t.guest_name}</div>
          <div class="testimonial-card__location">${t.guest_location}</div>
          ${t.stay_date ? `<div class="testimonial-card__date">${formatDate(t.stay_date)}</div>` : ''}
        </div>
      `;
    }).join('');

    // Dots
    if (dotsContainer) {
      dotsContainer.innerHTML = testimonials.map((_, i) =>
        `<button class="testimonials__dot${i === 0 ? ' active' : ''}" data-index="${i}"></button>`
      ).join('');

      $$('.testimonials__dot', dotsContainer).forEach(dot => {
        dot.addEventListener('click', () => {
          goToTestimonial(parseInt(dot.dataset.index, 10));
        });
      });
    }

    // Arrows
    const prev = $('#testimPrev');
    const next = $('#testimNext');
    if (prev) prev.addEventListener('click', () => {
      goToTestimonial((state.currentTestimonial - 1 + testimonials.length) % testimonials.length);
    });
    if (next) next.addEventListener('click', () => {
      goToTestimonial((state.currentTestimonial + 1) % testimonials.length);
    });
  }

  function goToTestimonial(index) {
    const carousel = $('#testimonialsCarousel');
    if (!carousel) return;

    state.currentTestimonial = index;
    carousel.style.transform = `translateX(-${index * 100}%)`;

    $$('.testimonials__dot').forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
  }

  // ══════════════════════════════════════════════
  // GRID ITEM OBSERVER (Stagger Animation)
  // ══════════════════════════════════════════════
  function observeGridItems() {
    const items = $$('.room-card, .service-card, .gallery-item');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    items.forEach(item => {
      item.classList.remove('visible');
      observer.observe(item);
    });
  }

  // ══════════════════════════════════════════════
  // BOOKING FORM
  // ══════════════════════════════════════════════
  function initDateDefaults() {
    const checkIn = $('#bookingCheckIn');
    const checkOut = $('#bookingCheckOut');
    if (!checkIn || !checkOut) return;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 3);

    checkIn.min = tomorrow.toISOString().split('T')[0];
    checkIn.value = tomorrow.toISOString().split('T')[0];
    checkOut.min = dayAfter.toISOString().split('T')[0];
    checkOut.value = dayAfter.toISOString().split('T')[0];

    checkIn.addEventListener('change', () => {
      const ci = new Date(checkIn.value);
      ci.setDate(ci.getDate() + 1);
      checkOut.min = ci.toISOString().split('T')[0];
      if (new Date(checkOut.value) <= new Date(checkIn.value)) {
        checkOut.value = ci.toISOString().split('T')[0];
      }
      updateBookingSummary();
    });

    checkOut.addEventListener('change', updateBookingSummary);
  }

  function populateBookingRoomSelect(rooms) {
    const select = $('#bookingRoom');
    if (!select) return;

    rooms.forEach(room => {
      const option = document.createElement('option');
      option.value = room.id || room.slug;
      option.dataset.slug = room.slug;
      option.dataset.price = room.price_per_night;
      option.textContent = `${room.name} — ${formatCurrency(room.price_per_night)}/night`;
      select.appendChild(option);
    });

    select.addEventListener('change', updateBookingSummary);
  }

  function updateBookingSummary() {
    const summary = $('#bookingSummary');
    const select = $('#bookingRoom');
    const checkIn = $('#bookingCheckIn');
    const checkOut = $('#bookingCheckOut');
    if (!summary || !select || !checkIn || !checkOut) return;

    const selectedOption = select.options[select.selectedIndex];
    if (!select.value || !checkIn.value || !checkOut.value) {
      summary.style.display = 'none';
      return;
    }

    const price = parseFloat(selectedOption.dataset.price);
    const ci = new Date(checkIn.value);
    const co = new Date(checkOut.value);
    const nights = Math.ceil((co - ci) / (1000 * 60 * 60 * 24));

    if (nights < 1) {
      summary.style.display = 'none';
      return;
    }

    const total = price * nights;

    $('#summaryRoom').textContent = selectedOption.textContent.split(' — ')[0];
    $('#summaryNights').textContent = `${nights} night${nights > 1 ? 's' : ''}`;
    $('#summaryTotal').textContent = formatCurrency(total);
    summary.style.display = 'block';
  }

  function initBookingForm() {
    const form = $('#bookingForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = $('#bookingSubmit');
      const original = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Processing...</span>';

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      data.guests_count = parseInt(data.guests_count, 10);

      try {
        await API.createBooking(data);
        showToast('Your reservation request has been submitted. Our team will confirm within 24 hours.');
        form.reset();
        initDateDefaults();
        $('#bookingSummary').style.display = 'none';
      } catch (err) {
        const message = err.error || err.errors?.[0]?.message || 'Unable to process your reservation. Please try again.';
        showToast(message);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = original;
      }
    });
  }

  // ══════════════════════════════════════════════
  // CONTACT FORM
  // ══════════════════════════════════════════════
  function initContactForm() {
    const form = $('#contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('.btn');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span>Sending...</span>';

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        await API.submitContact(data);
        showToast('Your message has been sent. Our concierge team will respond within 24 hours.');
        form.reset();
      } catch (err) {
        const message = err.error || err.errors?.[0]?.message || 'Unable to send your message. Please try again.';
        showToast(message);
      } finally {
        btn.disabled = false;
        btn.innerHTML = original;
      }
    });
  }

  // ══════════════════════════════════════════════
  // TOAST NOTIFICATION
  // ══════════════════════════════════════════════
  function showToast(message, duration = 5000) {
    const toast = $('#toast');
    const msgEl = $('#toastMessage');
    if (!toast || !msgEl) return;

    msgEl.textContent = message;
    toast.classList.add('active');

    setTimeout(() => {
      toast.classList.remove('active');
    }, duration);
  }

  // Make showToast globally accessible
  window.showToast = showToast;

  // ══════════════════════════════════════════════
  // FALLBACK DATA (when API is unavailable)
  // ══════════════════════════════════════════════
  function getFallbackRooms() {
    return [
      {
        id: '1', slug: 'ocean-pavilion-suite', name: 'Ocean Pavilion Suite', category: 'pavilion',
        description: 'Perched above the turquoise waters, the Ocean Pavilion Suite offers an uninterrupted panorama of the Indian Ocean. Floor-to-ceiling glass walls dissolve the boundary between interior luxury and the vast seascape.',
        short_desc: 'Panoramic ocean views with private infinity plunge pool and open-air living.',
        price_per_night: 1250, max_guests: 2, size_sqm: 185, bed_type: 'King', view_type: 'Ocean',
        rating: 4.9, is_featured: true,
        amenities: ['Private Pool', 'Ocean View', 'Butler Service', 'Spa Bath', 'Mini Bar', 'Terrace'],
        thumbnail: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200'],
      },
      {
        id: '2', slug: 'imperial-garden-villa', name: 'Imperial Garden Villa', category: 'villa',
        description: 'Nestled within lush tropical gardens, the Imperial Garden Villa is a sanctuary of refined elegance spanning over 300 square meters.',
        short_desc: 'Secluded tropical villa with private garden, heated pool, and dining pavilion.',
        price_per_night: 2800, max_guests: 4, size_sqm: 320, bed_type: 'King + Twin', view_type: 'Garden',
        rating: 5.0, is_featured: true,
        amenities: ['Private Pool', 'Garden', 'Butler Service', 'Kitchen', 'Outdoor Shower', 'Dining Pavilion'],
        thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200'],
      },
      {
        id: '3', slug: 'cliff-edge-retreat', name: 'Cliff Edge Retreat', category: 'suite',
        description: 'Carved into the dramatic volcanic cliffside, this extraordinary retreat offers a perspective found nowhere else.',
        short_desc: 'Dramatic cliffside suite with cantilevered terrace and infinity pool.',
        price_per_night: 1800, max_guests: 2, size_sqm: 210, bed_type: 'King', view_type: 'Cliff & Ocean',
        rating: 4.8, is_featured: true,
        amenities: ['Infinity Pool', 'Cliff View', 'Butler Service', 'Rain Shower', 'Fireplace'],
        thumbnail: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800',
        images: ['https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1200'],
      },
      {
        id: '4', slug: 'zen-mountain-lodge', name: 'Zen Mountain Lodge', category: 'lodge',
        description: 'High above the valley floor, the Zen Mountain Lodge draws inspiration from ancient Japanese minimalism.',
        short_desc: 'Minimalist mountain lodge with private onsen and valley views.',
        price_per_night: 950, max_guests: 2, size_sqm: 140, bed_type: 'King', view_type: 'Mountain',
        rating: 4.7, is_featured: false,
        amenities: ['Private Onsen', 'Mountain View', 'Meditation Room', 'Tea Ceremony Set'],
        thumbnail: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
        images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200'],
      },
      {
        id: '5', slug: 'royal-penthouse', name: 'Royal Penthouse', category: 'penthouse',
        description: 'The crown jewel of Aman Resorts, the Royal Penthouse occupies the entire top floor with 360-degree views.',
        short_desc: 'Top-floor penthouse with 360-degree views, private cinema, and rooftop pool.',
        price_per_night: 5500, max_guests: 6, size_sqm: 450, bed_type: 'King + 2 Queen', view_type: 'Panoramic',
        rating: 5.0, is_featured: true,
        amenities: ['Rooftop Pool', 'Private Cinema', 'Personal Chef', 'Spa Room', 'Wine Cellar'],
        thumbnail: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
        images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200'],
      },
      {
        id: '6', slug: 'tropical-overwater-bungalow', name: 'Tropical Overwater Bungalow', category: 'bungalow',
        description: 'Suspended above a crystalline lagoon, the Overwater Bungalow redefines island luxury.',
        short_desc: 'Overwater bungalow with glass floors, lagoon access, and organic interiors.',
        price_per_night: 1600, max_guests: 2, size_sqm: 165, bed_type: 'King', view_type: 'Lagoon',
        rating: 4.9, is_featured: true,
        amenities: ['Glass Floor', 'Lagoon Access', 'Sundeck', 'Outdoor Shower', 'Snorkeling Gear'],
        thumbnail: 'https://images.unsplash.com/photo-1439130490301-25e322d88054?w=800',
        images: ['https://images.unsplash.com/photo-1439130490301-25e322d88054?w=1200'],
      }
    ];
  }

  function getFallbackServices() {
    return [
      {
        name: 'Aman Spa & Wellness', category: 'wellness', price: 'From $250',
        short_desc: 'Holistic treatments inspired by ancient healing traditions.',
        image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200',
      },
      {
        name: 'Private Fine Dining', category: 'dining', price: 'From $180 pp',
        short_desc: 'Michelin-caliber cuisine in extraordinary private settings.',
        image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
      },
      {
        name: 'Ocean Expeditions', category: 'adventure', price: 'From $400',
        short_desc: 'Curated marine adventures with expert naturalists.',
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200',
      },
      {
        name: 'Wellness & Yoga Retreats', category: 'wellness', price: 'From $350/day',
        short_desc: 'Transformative retreats with master practitioners.',
        image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200',
      },
      {
        name: 'Helicopter & Yacht Transfers', category: 'transport', price: 'From $1,200',
        short_desc: 'Scenic arrivals by private helicopter or luxury yacht.',
        image_url: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1200',
      },
      {
        name: 'Cultural Immersion', category: 'cultural', price: 'From $200',
        short_desc: 'Authentic encounters with local traditions and artisans.',
        image_url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1200',
      }
    ];
  }

  function getFallbackGallery() {
    return [
      { title: 'The Grand Arrival', description: 'A first impression that takes your breath away', image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200', category: 'exterior' },
      { title: 'Infinity Edge', description: 'Where the pool meets the horizon', image_url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200', category: 'pool' },
      { title: 'Ocean Pavilion at Dusk', description: 'Golden hour in our signature suite', image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200', category: 'rooms' },
      { title: 'The Spa Sanctuary', description: 'Ancient healing traditions in a modern setting', image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200', category: 'spa' },
      { title: 'Garden Dining', description: 'Farm-to-table under the stars', image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200', category: 'dining' },
      { title: 'Cliffside Morning', description: 'Awakening above the clouds', image_url: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1200', category: 'exterior' },
      { title: 'The Library Bar', description: 'Rare vintages in an intimate setting', image_url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200', category: 'dining' },
      { title: 'Overwater Serenity', description: 'Life above the turquoise lagoon', image_url: 'https://images.unsplash.com/photo-1439130490301-25e322d88054?w=1200', category: 'rooms' },
      { title: 'Yoga at Dawn', description: 'Begin the day with intention', image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200', category: 'wellness' },
      { title: 'Mountain Mist', description: 'Where earth meets sky', image_url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200', category: 'exterior' },
      { title: 'Private Beach', description: 'Your own stretch of paradise', image_url: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200', category: 'exterior' },
      { title: 'The Grand Salon', description: 'Curated elegance in every detail', image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200', category: 'rooms' },
    ];
  }

  function getFallbackTestimonials() {
    return [
      {
        guest_name: 'Victoria Harrington', guest_location: 'London, United Kingdom', rating: 5,
        title: 'An experience beyond words', stay_date: '2024-11-15',
        content: 'In twenty years of traveling to the finest hotels in the world, nothing has come close to Aman Resorts. The Ocean Pavilion Suite was not simply a room — it was a private universe. The staff seemed to anticipate our every need before we were aware of it ourselves.',
      },
      {
        guest_name: 'James & Sophia Rothwell', guest_location: 'New York, USA', rating: 5,
        title: 'Our third visit — each one more magical', stay_date: '2024-09-22',
        content: 'We first came to Aman for our honeymoon. We returned for our fifth anniversary. Now, for our tenth, we brought our children. The Imperial Garden Villa gave us the space and privacy to be together as a family while still experiencing extraordinary luxury.',
      },
      {
        guest_name: 'Hiroshi Tanaka', guest_location: 'Tokyo, Japan', rating: 5,
        title: 'Wabi-sabi perfection', stay_date: '2024-08-10',
        content: 'As someone who values minimalism and intentional design, the Zen Mountain Lodge spoke to my soul. Every element was considered — the way morning light entered through the shoji screens, the temperature of the private onsen, the silence that felt not empty but full.',
      },
      {
        guest_name: 'Isabella Monteiro', guest_location: 'Sao Paulo, Brazil', rating: 5,
        title: 'Healing in paradise', stay_date: '2024-07-05',
        content: 'I came to Aman Resorts after a difficult year, seeking restoration. The wellness retreat exceeded every expectation. By the end of my seven-day stay, I had a clarity and peace I had not felt in years.',
      },
      {
        guest_name: 'Alexander & Nadia Volkov', guest_location: 'Moscow, Russia', rating: 5,
        title: 'The only place we celebrate', stay_date: '2024-12-31',
        content: 'For the past four years, we have celebrated every milestone at Aman Resorts. The Royal Penthouse is our tradition for New Year — the rooftop pool under the stars, the private chef preparing our favorite dishes.',
      }
    ];
  }

})();
