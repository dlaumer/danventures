import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MapView from './MapView';
import { selectWebmapId } from '@store/selectors';
import { getTranslation } from '../services/languageHelper';
import Header from './Header';
import SidePanel from './SidePanel';
import Settings from './Settings';
import MobileInfo from './MobileInfo';
import translations from '../constants/translations';
import {
    setFilterTimeActive,
    setFilterSpaceActive,
    setFilterTimeStart,
    setFilterTimeEnd,
    setFilterSpace,
    setFilterSpaceDrawing,
} from '@store/reducer';
import {
    selectFilterTimeActive,
    selectFilterSpaceActive,
    selectFilterSpaceDrawing,
    selectGeneralNumbers,
    selectLanguage,
} from '@store/selectors';
const MapViewContainer = () => {
    const generalNumbers = useSelector(selectGeneralNumbers);

    const [numbersDashboard, setNumbersDashboard] = useState(null);
    const language = useSelector(selectLanguage);

    const getTranslation = (id: string) => {
        if (Object.keys(translations).includes(id)) {
            return (translations as any)[id][language] || '';
        } else {
            console.log('WARNING: One string is missing: ' + id);
            return id;
        }
    };

    useEffect(() => {
        setNumbersDashboard(
            <div
                id="numbersDashboard"
                className="bg-lighergray !pb-[5px] p-[10px] flex w-full h-[60px]"
            >
                <div className="h-full w-1/5">
                    <div className="absolute text-xs">
                        {getTranslation('totalDistance')}
                    </div>
                    <div className="generalNumbers text-xl text-mainyellow font-bold flex items-end justify-center h-full w-full">
                        {generalNumbers.totalDistance + ' km'}
                    </div>
                </div>
                <div className="h-full w-1/5">
                    <div className="absolute text-xs">
                        {getTranslation('totalRides')}
                    </div>
                    <div className="generalNumbers text-xl text-mainyellow font-bold flex items-end justify-center h-full w-full">
                        {generalNumbers.totalRides}
                    </div>
                </div>
                <div className="h-full w-1/5">
                    <div className="absolute text-xs">
                        {getTranslation('totalDays')}
                    </div>
                    <div className="generalNumbers text-xl text-mainyellow font-bold flex items-end justify-center h-full w-full">
                        {generalNumbers.totalDays +
                            ' ' +
                            getTranslation('days')}
                    </div>
                </div>

                <div className="h-full w-1/5">
                    <div className="absolute text-xs">
                        {getTranslation('totalTravelDays')}
                    </div>
                    <div className="generalNumbers text-xl text-mainyellow font-bold flex items-end justify-center h-full w-full">
                        {generalNumbers.totalTravelDays +
                            ' ' +
                            getTranslation('days')}
                    </div>
                </div>

                <div className="h-full w-1/5">
                    <div className="absolute text-xs">
                        {getTranslation('totalCost')}
                    </div>
                    <div className="generalNumbers text-xl text-mainyellow font-bold flex items-end justify-center h-full w-full">
                        {generalNumbers.totalCost +
                            ' ' +
                            getTranslation('euros')}
                    </div>
                </div>
            </div>
        );
    }, [generalNumbers, language]);

    return (
        <div className={'fixed top-0 left-0 w-full h-full bg-lighergray'}>
            <Header></Header>
            <div className="flex w-full h-[calc(100%-60px)]  bg-lighergray">
                <SidePanel title="chartTitle"></SidePanel>
                <div className="w-1/2">
                    {numbersDashboard}
                    <MapView />
                    <div
                        id="filterTime"
                        className={`w-full p-[5px] my-[2.5px] bg-lighergray`}
                    >
                        <div id="filterTimeContainer"></div>
                    </div>
                </div>
            </div>
            <Settings></Settings>
        </div>
    );
};

export default MapViewContainer;
