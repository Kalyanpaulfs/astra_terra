'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Custom hook to handle property navigation context
 * Stores the current page as referrer when navigating to property details
 */
export function usePropertyNavigation() {
    const pathname = usePathname();

    /**
     * Call this function when a user clicks on a property link
     * to store the currentpage as the referrer for back navigation
     * Includes query parameters to preserve context like regionId
     */
    const storeReferrer = () => {
        if (typeof window !== 'undefined') {
            // Store both pathname and search params to preserve full context
            const fullPath = window.location.pathname + window.location.search;
            sessionStorage.setItem('propertyReferrer', fullPath);
        }
    };

    /**
     * Get the stored referrer
     */
    const getReferrer = (): string | null => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('propertyReferrer');
        }
        return null;
    };

    /**
     * Clear the stored referrer
     */
    const clearReferrer = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('propertyReferrer');
        }
    };

    return {
        storeReferrer,
        getReferrer,
        clearReferrer,
    };
}
