import {
    createSlice,
    // createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';

import { setLocale } from '@arcgis/core/intl';

// import { RootState, StoreDispatch, StoreGetState } from '../configureStore';

export type AppState = {
    language?: string;

    calculateTracksActive?: boolean;

    webmapId?: string;
    sidePanelContent?: string;
    filterTimeActive?: boolean;
    filterSpaceActive?: boolean;
    category?: string;

    filterTime?: any;
    filterTimeStart?: Date;
    filterTimeEnd?: Date;

    filterSpace?: any;
    filterSpaceDrawing?: boolean;

    generalNumbers?: any;

    locationData: any;
    visibleElements: number[];

    features?: any;
    attribute?: string;
    hoverFeatures?: any;
    sleepCategories?: any;

    isLoggedIn?: boolean;
    logInAttempt?: boolean;
    usernameEsri?: string;

    settingsContent?: string;
    settingsOpen?: boolean;
};

export const initialAppState: AppState = {
    language: 'en',

    calculateTracksActive: false,

    webmapId: '67372ff42cd145319639a99152b15bc3',
    sidePanelContent: 'analyze',
    filterTimeActive: true,
    filterSpaceActive: true,
    category: 'bioQuality',

    filterTime: null,
    filterTimeStart: null,
    filterTimeEnd: null,

    filterSpace: [],
    filterSpaceDrawing: false,

    generalNumbers: {
        totalDistance: 0,
        totalDays: 0,
        totalRides: 0,
        totalTravelDays: 0,
        totalCost: 0,
    },

    locationData: null,
    visibleElements: [],

    features: null,
    attribute: null,
    hoverFeatures: null,
    sleepCategories: null,

    isLoggedIn: false,
    logInAttempt: false,
    usernameEsri: 'login',

    settingsContent: 'languages',
    settingsOpen: false,
};

const slice = createSlice({
    name: 'App',
    initialState: initialAppState,
    reducers: {
        setLanguage: (state, action: PayloadAction<string>) => {
            setLocale(action.payload);
            state.language = action.payload;
        },
        setCalculateTracksActive: (state, action: PayloadAction<boolean>) => {
            state.calculateTracksActive = action.payload;
        },
        setSidePanelContent: (state, action: PayloadAction<string>) => {
            state.sidePanelContent = action.payload;
        },
        webmapIdChanged: (state, action: PayloadAction<string>) => {
            state.webmapId = action.payload;
        },
        setFilterTimeActive: (state) => {
            state.filterTimeActive = !state.filterTimeActive;
        },
        setFilterSpaceActive: (state) => {
            state.filterSpaceActive = !state.filterSpaceActive;
        },
        setCategory: (state, action: PayloadAction<string>) => {
            state.category = action.payload;
        },
        setFilterTime: (state, action: PayloadAction<any>) => {
            state.filterTime = action.payload;
        },
        setFilterTimeStart: (state, action: PayloadAction<Date>) => {
            state.filterTimeStart = action.payload;
        },
        setFilterTimeEnd: (state, action: PayloadAction<Date>) => {
            state.filterTimeEnd = action.payload;
        },
        addFilterSpace: (state, action: PayloadAction<any>) => {
            state.filterSpace.push(action.payload);
        },
        setFilterSpace: (state, action: PayloadAction<Array<any>>) => {
            state.filterSpace = action.payload;
        },
        setFilterSpaceDrawing: (state, action: PayloadAction<boolean>) => {
            state.filterSpaceDrawing = action.payload;
        },
        setGeneralNumbers: (state, action: PayloadAction<any>) => {
            state.generalNumbers = action.payload;
        },
        setLocationData: (state, action: PayloadAction<any>) => {
            state.locationData = action.payload;
        },
        addVisibleElement: (state, action: PayloadAction<number>) => {
            if (action.payload != null) {
                state.visibleElements.push(action.payload);
            }
        },
        removeVisibleElement: (state, action: PayloadAction<number>) => {
            state.visibleElements = state.visibleElements.filter(function (e) {
                return e !== action.payload;
            });
        },
        setFeatures: (state, action: PayloadAction<any>) => {
            state.features = action.payload;
        },
        setSleepCategories: (state, action: PayloadAction<any>) => {
            state.sleepCategories = action.payload;
        },
        setAttribute: (state, action: PayloadAction<string>) => {
            state.attribute = action.payload;
        },
        setHoverFeatures: (state, action: PayloadAction<any>) => {
            state.hoverFeatures = action.payload;
        },
        setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.isLoggedIn = action.payload;
        },
        setLogInAttempt: (state, action: PayloadAction<boolean>) => {
            state.logInAttempt = action.payload;
        },
        setUsernameEsri: (state, action: PayloadAction<string>) => {
            state.usernameEsri = action.payload;
        },
        setSettingsContent: (state, action: PayloadAction<string>) => {
            state.settingsContent = action.payload;
        },
        toggleSettingsOpen: (state) => {
            state.settingsOpen = !state.settingsOpen;
        },
    },
});

const { reducer } = slice;

export const {
    webmapIdChanged,
    setCalculateTracksActive,
    setSidePanelContent,
    setLanguage,
    setFilterTimeActive,
    setFilterSpaceActive,
    setCategory,
    setFilterTime,
    setFilterTimeStart,
    setFilterTimeEnd,
    addFilterSpace,
    setFilterSpace,
    setFilterSpaceDrawing,
    setGeneralNumbers,
    setLocationData,
    addVisibleElement,
    removeVisibleElement,
    setFeatures,
    setSleepCategories,
    setAttribute,
    setHoverFeatures,
    setIsLoggedIn,
    setLogInAttempt,
    setUsernameEsri,
    setSettingsContent,
    toggleSettingsOpen,
} = slice.actions;

export default reducer;
