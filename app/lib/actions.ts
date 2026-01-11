'use server';

import { getProperty, getListings } from './api';

export async function fetchProperty(id: string) {
    return await getProperty(id);
}

export async function fetchListings(filter: any) {
    return await getListings(filter);
}
