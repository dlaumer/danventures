/*
--------------
Header.tsx
--------------

UI for the Header, different buttons, dropdowns and titles

*/
import { useDispatch, useSelector } from 'react-redux';

import React, { FC, useEffect, useState } from 'react';
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
import Dropdown from './Dropdown';
import Button from './Button';
import ChartDistance from './ChartDistance';
import ChartSleeps from './ChartSleeps';

import penTool from './../constants/pen-tool.svg';
import clock from './../constants/clock.svg';
import crop from './../constants/crop.svg';
import sliders from './../constants/sliders.svg';

import translations from '../constants/translations';

type PanelAnalyzeProps = {
    title?: string;
    active?: boolean;
};
const PanelAnalyze: FC<PanelAnalyzeProps & React.ComponentProps<'div'>> = ({
    title = 'Default',
    active = false,
}) => {
    const dispatch = useDispatch();
    const generalNumbers = useSelector(selectGeneralNumbers);
    const language = useSelector(selectLanguage);

    const [numbersDashboard, setNumbersDashboard] = useState(null);

    useEffect(() => {
        setNumbersDashboard(
            <div
                id="numbersDashboard"
                className="bg-lighergray p-[10px] rounded-xl flex w-full h-1/5"
            >
                <div className="h-full w-1/4">
                    <div className="absolute text-xs">
                        {getTranslation('totalDistance')}
                    </div>
                    <div className="text-xl text-mainyellow font-bold flex items-center justify-center h-full w-full">
                        {generalNumbers.totalDistance + ' km'}
                    </div>
                </div>
                <div className="h-full w-1/4">
                    <div className="absolute text-xs">
                        {getTranslation('totalRides')}
                    </div>
                    <div className="text-xl text-mainyellow font-bold flex items-center justify-center h-full w-full">
                        {generalNumbers.totalRides}
                    </div>
                </div>
                <div className="h-full w-1/4">
                    <div className="absolute text-xs">
                        {getTranslation('totalDays')}
                    </div>
                    <div className="text-xl text-mainyellow font-bold flex items-center justify-center h-full w-full">
                        {generalNumbers.totalDays +
                            ' ' +
                            getTranslation('days')}
                    </div>
                </div>

                <div className="h-full w-1/4">
                    <div className="absolute text-xs">
                        {getTranslation('totalTravelDays')}
                    </div>
                    <div className="text-xl text-mainyellow font-bold flex items-center justify-center h-full w-full">
                        {generalNumbers.totalTravelDays +
                            ' ' +
                            getTranslation('days')}
                    </div>
                </div>
            </div>
        );
    }, [generalNumbers, language]);

    const getTranslation = (id: string) => {
        if (Object.keys(translations).includes(id)) {
            return (translations as any)[id][language] || '';
        } else {
            console.log('WARNING: One string is missing: ' + id);
            return id;
        }
    };

    // UI part
    return (
        <div
            id="analyze"
            className={`flex flex-col flex-none z-30 w-full bg-backgroundgray h-full`}
        >
            <div
                id="filterChart"
                className="flex-1 w-full p-[5px] my-[2.5px]  overflow-auto"
            >
                {numbersDashboard}
                <div id="chartsContainer" className="flex h-4/5 w-full">
                    <ChartDistance />
                    <ChartSleeps />
                </div>
            </div>
            <div id="filterTime" className={`w-full p-[5px] my-[2.5px]`}>
                <div id="filterTimeContainer"></div>
            </div>
        </div>
    );
};

export default PanelAnalyze;
