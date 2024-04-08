/*
--------------
Header.tsx
--------------

UI for the Header, different buttons, dropdowns and titles

*/
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Button from './Button';
import Dropdown from './Dropdown';
import {
    selectSettingsOpen,
    selectCalculateTracksActive,
} from '../store/selectors';
import { toggleSettingsOpen, setCalculateTracksActive } from '@store/reducer';
import { getTranslation } from '@services/languageHelper';

import settings from './../constants/Settings.svg';
import edit from './../constants/Edit.svg';
import analyze from './../constants/pie-chart.svg';
import process from './../constants/refresh-cw.svg';
import print from './../constants/printer.svg';
import logoGlobe from './../constants/logoGlobe.png';
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
const Header = () => {
    const dispatch = useDispatch();
    // UI part

    const settingsOpen = useSelector(selectSettingsOpen);
    const calculateTracksActive = useSelector(selectCalculateTracksActive);

    const [buttons, setButtons] = useState(null);
    const [loginButton, setLoginButton] = useState(null);
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
                className="!pb-[5px] p-[10px] flex w-1/2 h-[60px]"
            >
                <div className="h-full w-1/5">
                    <div className="absolute text-xs">
                        {getTranslation('totalDistance')}
                    </div>
                    <div className="generalNumbers text-xl text-white font-bold flex items-end justify-center h-full w-full">
                        {generalNumbers.totalDistance + ' km'}
                    </div>
                </div>
                <div className="h-full w-1/5">
                    <div className="absolute text-xs">
                        {getTranslation('totalRides')}
                    </div>
                    <div className="generalNumbers text-xl text-white font-bold flex items-end justify-center h-full w-full">
                        {generalNumbers.totalRides}
                    </div>
                </div>
                <div className="h-full w-1/5">
                    <div className="absolute text-xs">
                        {getTranslation('totalDays')}
                    </div>
                    <div className="generalNumbers text-xl text-white font-bold flex items-end justify-center h-full w-full">
                        {generalNumbers.totalDays +
                            ' ' +
                            getTranslation('days')}
                    </div>
                </div>

                <div className="h-full w-1/5">
                    <div className="absolute text-xs">
                        {getTranslation('totalTravelDays')}
                    </div>
                    <div className="generalNumbers text-xl text-white font-bold flex items-end justify-center h-full w-full">
                        {generalNumbers.totalTravelDays +
                            ' ' +
                            getTranslation('days')}
                    </div>
                </div>

                <div className="h-full w-1/5">
                    <div className="absolute text-xs">
                        {getTranslation('totalCost')}
                    </div>
                    <div className="generalNumbers text-xl text-white font-bold flex items-end justify-center h-full w-full">
                        {generalNumbers.totalCost +
                            ' ' +
                            getTranslation('euros')}
                    </div>
                </div>
            </div>
        );
    }, [generalNumbers, language]);
    return (
        <div
            id="header"
            className="flex flex-row flex-none justify-between z-30 w-full h-[60px] py-1 bg-mainyellow px-[15px]"
        >
            <div
                id="titleContainer"
                className="h-full flex items-center gap-2 mr-4 font-noigrotesk"
            >
                <div className="leading-snug text-xl font-bold">
                    {getTranslation('title')}
                </div>
                <div className="leading-snug text-xs font-bold">
                    {getTranslation('subTitle')}
                </div>
            </div>
            {numbersDashboard}

            <div className="flex flex-row h-full items-center gap-2 mr-4 font-noigrotesk">
                <div className="flex flex-row h-[80%] items-center gap-2 font-noigrotesk">
                    <Button
                        titleKey="calculateTracks"
                        onClick={() => dispatch(setCalculateTracksActive(true))}
                        isActive={calculateTracksActive}
                    ></Button>
                    <Button
                        titleKey=""
                        onClick={() => dispatch(toggleSettingsOpen())}
                        isActive={settingsOpen}
                        icon={settings}
                    ></Button>
                    {loginButton}
                </div>
            </div>
        </div>
    );
};

export default Header;
