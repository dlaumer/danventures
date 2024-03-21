import React from 'react';
import { useSelector } from 'react-redux';
import MapView from './MapView';
import { selectWebmapId } from '@store/selectors';
import { getTranslation } from '../services/languageHelper';
import Header from './Header';
import SidePanel from './SidePanel';
import Settings from './Settings';
import MobileInfo from './MobileInfo';

const MapViewContainer = () => {
    return (
        <div className={'fixed top-0 left-0 w-full h-full'}>
            <Header></Header>
            <MapView />
            <SidePanel title="chartTitle"></SidePanel>
            <Settings></Settings>
            <MobileInfo></MobileInfo>
            <div id="timeSlider"></div>
        </div>
    );
};

export default MapViewContainer;
