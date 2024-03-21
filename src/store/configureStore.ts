import {
    configureStore,
    getDefaultMiddleware,
    DeepPartial,
} from '@reduxjs/toolkit';

import rootReducer from './rootReducer';

import getPreloadedState from './getPreloadedState';

export type RootState = ReturnType<typeof rootReducer>;

export type PartialRootState = DeepPartial<RootState>;

const defaultMiddlewareConfig = {
    serializableCheck: {
        ignoredPaths: ['state.features'],
    },
};

let store: any;
const configureAppStore = (preloadedState: PartialRootState = {}) => {
    store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({ serializableCheck: false }),
        preloadedState: preloadedState as any,
    });

    return store;
};

export type AppStore = ReturnType<typeof configureAppStore>;

export type StoreDispatch = ReturnType<typeof configureAppStore>['dispatch'];

export type StoreGetState = ReturnType<typeof configureAppStore>['getState'];

export { store, getPreloadedState };

export default configureAppStore;
