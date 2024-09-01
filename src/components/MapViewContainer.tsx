import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MapView from './MapView';
import { selectWebmapId } from '@store/selectors';
import { getTranslation } from '../services/languageHelper';
import Header from './Header';
import SidePanel from './SidePanel';
import Settings from './Settings';
import MobileInfo from './MobileInfo';
import LocationsPanel from './LocationsPanel';

const MapViewContainer = () => {
    return (
        <div className={'fixed top-0 left-0 w-full h-full bg-lighergray'}>
            <Header></Header>
            <div className="flex w-full h-[calc(100%-60px)]  bg-lighergray">
                <SidePanel title="chartTitle"></SidePanel>
                <div id="mapviewContainer" className="w-1/2">
                    <MapView />
                    <div
                        id="filterTime"
                        className={`w-full p-[5px] my-[2.5px] bg-lighergray`}
                    >
                        <div id="filterTimeContainer"></div>
                    </div>
                </div>
                <LocationsPanel></LocationsPanel>
            </div>
            <Settings></Settings>

            <div
                id="handleStatistics"
                className="handle absolute bottom-0 left-0 h-[40px] w-[48%] bg-mainyellow rounded-t-xl flex items-center justify-center"
                onClick={() => {
                    document
                        .getElementById('sidePanel')
                        .classList.toggle('sidePanelUp');
                    document
                        .getElementById('numbersDashboard')
                        .classList.toggle('dashboardOn');
                    document
                        .getElementById('handleStatistics')
                        .classList.toggle('handleStatisticsUp');
                }}
            >
                <div>{getTranslation('statistics')}</div>
            </div>
            <div
                id="handleLocations"
                className="handle absolute bottom-0 right-0 h-[40px] w-[48%] bg-mainyellow rounded-t-xl flex items-center justify-center"
                onClick={() => {
                    document
                        .getElementById('locationsPanel')
                        .classList.toggle('locationsPanelUp');

                    document
                        .getElementById('handleLocations')
                        .classList.toggle('handleLocationsUp');
                }}
            >
                <div>{getTranslation('timeline')}</div>
            </div>
        </div>
    );
};

export default MapViewContainer;
