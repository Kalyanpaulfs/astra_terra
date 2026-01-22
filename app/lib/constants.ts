/**
 * Brand Colors - Astra Terra
 * Dubai luxury real estate color palette
 */

export const COLORS = {
    // Primary Dubai Gold
    DUBAI_GOLD: '#DEC993',
    DUBAI_GOLD_LIGHT: '#DFBD69',
    DUBAI_GOLD_DARK: '#926F34',

    // Secondary Gold
    GOLD_ACCENT: '#C5A265',

    // Gradients (for inline use)
    GOLD_GRADIENT: 'linear-gradient(to right, #DFBD69, #926F34)',
    GOLD_GRADIENT_VERTICAL: 'linear-gradient(to bottom, #DFBD69, #926F34)',

    // Dark backgrounds
    DARK_BG: '#050A10',
    DARK_BG_SECONDARY: '#0D1625',

    // Overlays
    OVERLAY_DARK: 'rgba(5,10,16,0.9)',
    OVERLAY_MEDIUM: 'rgba(5,10,16,0.7)',
    OVERLAY_LIGHT: 'rgba(5,10,16,0.5)',

    // White with opacity
    WHITE: '#FFFFFF',
    WHITE_90: 'rgba(255,255,255,0.9)',
    WHITE_80: 'rgba(255,255,255,0.8)',
    WHITE_70: 'rgba(255,255,255,0.7)',
    WHITE_60: 'rgba(255,255,255,0.6)',
    WHITE_50: 'rgba(255,255,255,0.5)',
    WHITE_10: 'rgba(255,255,255,0.1)',
    WHITE_05: 'rgba(255,255,255,0.05)',

    // Gold with opacity (for backgrounds, borders, etc.)
    GOLD_10: 'rgba(222,201,147,0.1)',
    GOLD_20: 'rgba(222,201,147,0.2)',
    GOLD_30: 'rgba(222,201,147,0.3)',
    GOLD_05: 'rgba(222,201,147,0.05)',

    // Accent Gold with opacity
    ACCENT_GOLD_10: 'rgba(197,162,101,0.1)',
    ACCENT_GOLD_20: 'rgba(197,162,101,0.2)',
    ACCENT_GOLD_30: 'rgba(197,162,101,0.3)',
    ACCENT_GOLD_05: 'rgba(197,162,101,0.05)',
} as const;

/**
 * Typography
 */
export const FONTS = {
    SERIF: '"Playfair Display", serif',
    SANS: '"Montserrat", sans-serif',
    BODY: 'system-ui, -apple-system, sans-serif',
} as const;

/**
 * Common styles
 */
export const STYLES = {
    // Card styles
    PREMIUM_CARD_BORDER: `1px solid ${COLORS.WHITE_05}`,
    PREMIUM_CARD_SHADOW: '0 10px 30px rgba(0,0,0,0.3)',

    // Hover transitions
    TRANSITION_DEFAULT: 'all 0.3s ease',
    TRANSITION_SMOOTH: 'all 0.5s ease',

    // Border radius
    RADIUS_SMALL: '4px',
    RADIUS_MEDIUM: '8px',
    RADIUS_LARGE: '12px',
    RADIUS_PILL: '50px',
} as const;

/**
 * Breakpoints (matching Tailwind defaults)
 */
export const BREAKPOINTS = {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
} as const;

/**
 * Z-Index layers
 */
export const Z_INDEX = {
    BACKGROUND: 0,
    CONTENT: 1,
    DROPDOWN: 10,
    STICKY: 20,
    MODAL_BACKDROP: 30,
    MODAL: 40,
    POPOVER: 50,
    TOOLTIP: 60,
} as const;
