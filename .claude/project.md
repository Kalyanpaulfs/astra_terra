# Astra Terra Properties - Real Estate Platform

**Project Type:** Next.js 14 Real Estate Website  
**Status:** Production (Deployed on Vercel)  
**Domain:** astraterra.ae  
**Migration:** Migrated from Laravel to Next.js

## 🎯 Project Overview

Astra Terra Properties is a premium real estate platform for Dubai/UAE property listings. The platform showcases properties for sale and rent, integrates with Pixxi CRM API for property management, and provides interactive maps, search functionality, and contact forms.

> [!IMPORTANT]
> **Deployment & Git Push Approval Required**
> - `git push origin roki-new` - Requires user approval before pushing
> - `vercel --prod` - Requires user approval before production deployment
> - Always set `SafeToAutoRun: false` for these commands

## 🛠️ Tech Stack

**Core Framework:**
- Next.js 14.2.0 (App Router)
- React 18.3.0
- TypeScript 5.3.0

**Animation & Interactivity:**
- GSAP 3.14.2 with @gsap/react
- Framer Motion 12.26.2
- AOS (Animate On Scroll) 2.3.4

**Maps & Location:**
- Leaflet 1.9.4
- React Leaflet 4.2.1
- React Leaflet Cluster 2.1.0

**Forms & Validation:**
- React Hook Form 7.51.0
- React Google reCAPTCHA 3.1.0

**Backend Integration:**
- Pixxi CRM API (Property Management)
- Firebase 12.8.0 (likely for auth/database)
- Axios 1.7.0 (HTTP client)

**Media & Assets:**
- Cloudinary 2.9.0 (Image management)
- Sharp 0.34.5 (Image optimization)
- Phosphor Icons

**Other:**
- React Quill 2.0.0 (Rich text editor for blog/admin)
- Lodash 4.17.21 (Utilities)

## 📐 Architecture

```
astra_terra/
├── app/
│   ├── page.tsx                 # Homepage
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   │
│   ├── api/                     # API Routes
│   │   ├── properties/          # Pixxi CRM property fetching
│   │   ├── contact/             # Contact form submission
│   │   └── chat/                # Chat integration
│   │
│   ├── components/              # React Components (51+)
│   │   ├── Navbar.tsx           # Main navigation
│   │   ├── MobileNav.tsx        # Mobile navigation
│   │   ├── Footer.tsx           # Footer component
│   │   ├── HeroVideo.tsx        # Hero section with video
│   │   ├── HeroParallax.tsx     # Parallax hero effect
│   │   ├── PropertyCard.tsx     # Property listing card
│   │   ├── PropertyDetails.tsx  # Property detail page
│   │   ├── PropertyCarousel.tsx # Image carousel
│   │   ├── SearchBar.tsx        # Property search
│   │   ├── ContactForm.tsx      # Contact form
│   │   ├── FeaturedSection.tsx  # Featured properties
│   │   ├── GallerySection.tsx   # Gallery display
│   │   ├── DeveloperCard.tsx    # Developer cards
│   │   ├── WhyChooseUs.tsx      # Trust/benefits section
│   │   └── ...more
│   │
│   ├── lib/                     # Utilities & Actions
│   │   ├── api.ts               # API helper functions
│   │   ├── actions.ts           # Server actions
│   │   ├── firebase.ts          # Firebase config
│   │   ├── constants.ts         # App constants
│   │   ├── videoCache.ts        # Video caching logic
│   │   └── navigation-utils.ts  # Navigation helpers
│   │
│   ├── buy/                     # Buy properties page
│   ├── rent/                    # Rent properties page
│   ├── properties-search/       # Search results page
│   ├── developers/              # Developers listing
│   ├── locations/               # Location pages
│   ├── map/                     # Interactive map view
│   ├── blogs/                   # Blog section
│   ├── founder/                 # About founder page
│   ├── list-your-property/      # Property listing form
│   ├── admin/                   # Admin panel
│   └── sitemap.html/            # Sitemap page
│
├── public/                      # Static Assets
│   ├── images/
│   ├── videos/
│   └── icons/
│
├── scripts/                     # Build/utility scripts
├── doc/                         # Documentation
├── .env.local                   # Environment variables
├── next.config.js               # Next.js configuration
├── tsconfig.json                # TypeScript config
├── vercel.json                  # Vercel deployment config
└── package.json                 # Dependencies
```

## 🔑 Key Features

1. **Property Listings**
   - Buy/Rent property search
   - Advanced filtering (price, location, type)
   - Property details with carousel
   - Pixxi CRM API integration

2. **Interactive Maps**
   - Leaflet-based property map
   - Location clustering
   - Property markers with popups

3. **Search & Discovery**
   - Real-time property search
   - Location-based browsing
   - Developer filtering
   - Price range filtering

4. **User Engagement**
   - Contact forms with reCAPTCHA
   - Property inquiry system
   - "List Your Property" form
   - Live chat integration

5. **Content**
   - Blog section
   - Founder/About page
   - Developer profiles
   - Location pages

6. **Admin Panel**
   - Content management
   - Property management (via Pixxi CRM)
   - Blog editor (React Quill)

## 🌐 API Integration

### Pixxi CRM API
The platform integrates with Pixxi CRM for property management:

**Base URL:** `https://dataapi.pixxicrm.ae/pixxiapi/v1/properties/Astra Terra Properties L.L.C`

**Authentication:**
- Token-based authentication (PIXXI_TOKEN in .env)

**Endpoints Used:**
- GET properties list (buy/rent)
- GET property details
- POST property inquiries
- POST contact form submissions

## 🎨 Design System

**Animations:**
- Scroll-triggered animations (GSAP ScrollTrigger)
- Page transitions (Framer Motion)
- Parallax effects on hero sections
- AOS animations for elements

**Maps:**
- Custom Leaflet styling
- Property clustering for performance
- Interactive markers with popups

**Images:**
- Cloudinary for optimization
- Sharp for build-time processing
- Next.js Image optimization
- Remote patterns allowed (all domains)

## 📋 Environment Variables

Required in `.env.local`:

```bash
# Pixxi CRM API (REQUIRED)
PIXXI_TOKEN=your_pixxi_api_token_here
PIXXI_WEBHOOK_TOKEN=your_pixxi_webhook_token_here

# Optional
PIXXI_API_URL=custom_api_url
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=site_key
RECAPTCHA_SECRET_KEY=secret_key
EMAIL_SERVICE_API_KEY=email_api_key
EMAIL_TO=info@astraterra.ae
```

## 🚀 Development

**Install:**
```bash
npm install
```

**Run Dev Server:**
```bash
npm run dev
# Opens at http://localhost:3000
```

**Build:**
```bash
npm run build
npm start
```

**Lint:**
```bash
npm run lint
```

## 📦 Deployment

**Platform:** Vercel

**Configuration:** `vercel.json`

**Features:**
- Automatic deployments from git
- Edge functions for API routes
- Image optimization
- CDN distribution

## 🔍 SEO

**Implemented:**
- Dynamic sitemap generation (`sitemap.ts`)
- Robots.txt configuration (`robots.ts`)
- Sitemap HTML page for users
- Meta tags for all pages
- Structured data for properties

## 📝 Notes

**Migration from Laravel:**
- Original backend: Laravel PHP
- Migration completed to Next.js full-stack
- API routes replace Laravel controllers
- React components replace Blade templates

**Performance:**
- Image optimization with Sharp
- Video caching system
- Property data streaming
- Component code-splitting

**Accessibility:**
- Semantic HTML
- ARIA labels
- Keyboard navigation
- reCAPTCHA for forms

---

**Last Updated:** January 25, 2025  
**Version:** 1.0.0  
**Maintained By:** RoyRoki
