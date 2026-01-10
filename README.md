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

Create a `.env.local` file in the root directory with the following variables:

```bash
# Pixxi CRM API Configuration (REQUIRED)
# Get your token from: Pixxi CRM > Admin > Integrations > Pixxi Forms
PIXXI_TOKEN=your_pixxi_api_token_here
PIXXI_WEBHOOK_TOKEN=your_pixxi_webhook_token_here

# Optional: Custom API URL (if different from default)
# PIXXI_API_URL=https://dataapi.pixxicrm.ae/pixxiapi/v1/properties/Astra Terra Properties L.L.C

# Google reCAPTCHA (optional)
# NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
# RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# Email Service (optional - for sending contact form emails)
# EMAIL_SERVICE_API_KEY=your_email_service_api_key
# EMAIL_TO=info@astraterra.ae
```

**Important:** Without `PIXXI_TOKEN` configured, the properties API will not work and you'll see errors in the console.
