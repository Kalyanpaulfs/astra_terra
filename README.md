# Astra Terra Properties - Next.js Application

This is the Next.js version of the Astra Terra Properties website, migrated from Laravel.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.local.example .env.local
```

3. Fill in your environment variables in `.env.local`

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` - Next.js app directory with pages and API routes
- `app/api/` - API routes (properties, contact, chat)
- `app/components/` - React components
- `public/` - Static assets (images, videos, etc.)
- `app/styles/` - CSS files

## Environment Variables

See `.env.local.example` for required environment variables.

