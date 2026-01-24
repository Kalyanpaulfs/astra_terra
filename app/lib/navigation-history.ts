/**
 * Navigation History Tracker
 * 
 * Provides global navigation tracking to ensure users can navigate back
 * to the correct page with the correct context, even through complex
 * navigation flows like: locations → properties search → property details
 */

const NAVIGATION_KEY = 'astra_terra_nav_history';

export interface NavigationEntry {
    path: string;
    timestamp: number;
}

/**
 * Store the current page in navigation history
 * Call this when navigating to a new page
 */
export function trackNavigation(path: string): void {
    if (typeof window === 'undefined') return;

    try {
        const history = getNavigationHistory();

        // Don't add duplicate consecutive entries
        if (history.length > 0 && history[history.length - 1].path === path) {
            return;
        }

        // Add new entry
        history.push({
            path,
            timestamp: Date.now()
        });

        // Keep only last 10 entries to avoid storage bloat
        const trimmedHistory = history.slice(-10);

        sessionStorage.setItem(NAVIGATION_KEY, JSON.stringify(trimmedHistory));
    } catch (e) {
        console.error('Failed to track navigation:', e);
    }
}

/**
 * Get the navigation history
 */
export function getNavigationHistory(): NavigationEntry[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = sessionStorage.getItem(NAVIGATION_KEY);
        if (!stored) return [];

        const history = JSON.parse(stored);

        // Clean up old entries (older than 1 hour)
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        return history.filter((entry: NavigationEntry) => entry.timestamp > oneHourAgo);
    } catch (e) {
        console.error('Failed to get navigation history:', e);
        return [];
    }
}

/**
 * Get the previous page from navigation history
 * @param currentPath - Current page path to exclude from results
 * @returns Previous page path or null
 */
export function getPreviousPage(currentPath: string): string | null {
    const history = getNavigationHistory();

    // Filter out the current page
    const filtered = history.filter(entry => entry.path !== currentPath);

    if (filtered.length === 0) return null;

    // Return the most recent page that's not the current page
    return filtered[filtered.length - 1].path;
}

/**
 * Clear navigation history
 */
export function clearNavigationHistory(): void {
    if (typeof window === 'undefined') return;

    try {
        sessionStorage.removeItem(NAVIGATION_KEY);
    } catch (e) {
        console.error('Failed to clear navigation history:', e);
    }
}
