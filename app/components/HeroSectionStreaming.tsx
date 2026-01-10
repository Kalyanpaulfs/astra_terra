import { getMetadata } from '../lib/api';
import HeroSectionServer from './HeroSectionServer';

export default async function HeroSectionStreaming() {
    const meta = await getMetadata();
    return <HeroSectionServer cities={meta.cities} propertyTypes={meta.propertyTypes} />;
}

