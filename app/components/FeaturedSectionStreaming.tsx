import { getListings } from '../lib/api';
import FeaturedSection from './FeaturedSection';

export default async function FeaturedSectionStreaming() {
    const listings = await getListings({ size: 12 });
    return <FeaturedSection listings={listings} />;
}

