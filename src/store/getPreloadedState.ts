import { PartialRootState } from './configureStore';

import { initialAppState, AppState } from './reducer';

const getPreloadedAppState = (): AppState => {
    return {
        ...initialAppState,
    };
};

const getPreloadedState = (): PartialRootState => {
    return {
        App: getPreloadedAppState(),
    };
};

export default getPreloadedState;
