import React from 'react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import MapViewContainer from '@components/MapViewContainer';
import { setLanguage } from '@store/reducer';
import { useDispatch } from 'react-redux';

export const Map = () => {
    const dispatch = useDispatch();

    const query = location.search.substr(1);
    const result: any = {};
    query.split('&').forEach(function (part) {
        const item = part.split('=');
        result[item[0]] = decodeURIComponent(item[1]);
    });

    if (result['lang'] != null) {
        dispatch(setLanguage(result['lang']));
    } else {
        // Construct URLSearchParams object instance from current URL querystring.
        const queryParams = new URLSearchParams(window.location.search);
        // Set new or modify existing parameter value.
        queryParams.set('lang', 'en');
        // Replace current querystring with the new one.
        history.replaceState(null, null, '?' + queryParams.toString());
    }

    return (
        <>
            <ErrorBoundary>
                <MapViewContainer />
            </ErrorBoundary>
        </>
    );
};

export default Map;
