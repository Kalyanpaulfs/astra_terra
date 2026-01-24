/**
 * Navigation Utilities
 * 
 * Provides smart, context-aware back link generation for various pages
 * to ensure users can always navigate back appropriately, regardless of
 * how they arrived at the page (direct URL, external link, etc.)
 */

/**
 * Generate a smart back link for property detail pages
 * 
 * @param pathname - Current page pathname (e.g., '/buy/villa/123' or '/rent/apartment/456')
 * @param propertyType - Type of property (e.g., 'Villa', 'Apartment')
 * @param referrer - Optional referrer URL or path to determine navigation context
 * @returns Appropriate back URL with search parameters
 */
export function getBackLinkForPropertyDetails(
    pathname: string | null,
    propertyType?: string,
    referrer?: string | null
): string {
    // Check if user came from locations page via referrer
    if (referrer) {
        if (referrer.includes('/locations') || referrer.includes('regionId=')) {
            return '/locations';
        }
        if (referrer.includes('/developers') || referrer.includes('developer=')) {
            return '/developers';
        }
    }

    // Default behavior: generate properties-search link
    let base = '/properties-search';
    const params = new URLSearchParams();

    if (pathname?.includes('/rent')) {
        params.set('listtype', 'RENT');
    } else if (pathname?.includes('/buy')) {
        params.set('listtype', 'SELL');
    }

    if (propertyType) {
        params.set('type', propertyType);
    }

    const queryString = params.toString();
    return queryString ? `${base}?${queryString}` : base;
}

/**
 * Generate a smart back link for properties search page
 * 
 * @param searchParams - Current URL search parameters
 * @returns Appropriate back URL based on search context
 */
export function getBackLinkForPropertiesSearch(
    searchParams: URLSearchParams | null
): string {
    if (!searchParams) {
        return '/';
    }

    const listtype = searchParams.get('listtype');
    const regionId = searchParams.get('regionId');
    const developer = searchParams.get('developer');

    // If searching by region/location, go back to locations page
    if (regionId) {
        return '/locations';
    }

    // If searching by developer, go back to developers page
    if (developer) {
        return '/developers';
    }

    // If searching for rentals, go back to rent page
    if (listtype === 'RENT') {
        return '/rent';
    }

    // If searching for sales, go back to buy page
    if (listtype === 'SELL' || listtype === 'SALE') {
        return '/buy';
    }

    // If searching for new projects, go back to buy page
    if (listtype === 'NEW') {
        return '/buy';
    }

    // Default: go to home page
    return '/';
}

/**
 * Get back link for developer detail page
 * 
 * @returns URL to developers listing page
 */
export function getBackLinkForDeveloperDetail(): string {
    return '/developers';
}

/**
 * Get back link for blog detail page
 * 
 * @returns URL to blogs listing page
 */
export function getBackLinkForBlogDetail(): string {
    return '/blogs';
}
