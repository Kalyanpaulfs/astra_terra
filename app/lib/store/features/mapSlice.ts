import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define Property interface here to match what we expect
export interface Property {
    id: string | number;
    title: string;
    price: number | string;
    latitude?: number;
    longitude?: number;
    photos?: string[];
    imgUrl?: string[];
    listingType?: string;
    completionStatus?: string;
    propertyType?: string[];
    sellParam?: any;
    rentParam?: any;
    [key: string]: any;
}

interface MapState {
    properties: Property[];
    activeFilter: 'ALL' | 'SELL' | 'RENT' | 'NEW';
}

const initialState: MapState = {
    properties: [],
    activeFilter: 'ALL',
};

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        setProperties: (state, action: PayloadAction<Property[]>) => {
            state.properties = action.payload;
        },
        setFilter: (state, action: PayloadAction<'ALL' | 'SELL' | 'RENT' | 'NEW'>) => {
            state.activeFilter = action.payload;
        },
    },
});

export const { setProperties, setFilter } = mapSlice.actions;

export default mapSlice.reducer;
