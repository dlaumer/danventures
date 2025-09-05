/*
--------------
Timeline.tsx
--------------

UI for the Timeline 

*/
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Button from './Button';
import Dropdown from './Dropdown';
import {
    selectSettingsOpen,
    selectCalculateTracksActive,
    selectFilterTimeStart,
    selectFilterTimeEnd,
    selectFilterTime,
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
    setFilterTime,
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
const Timeline = () => {
    const dispatch = useDispatch();
    // UI part

    const [buttons, setButtons] = useState(null);

    const language = useSelector(selectLanguage);

    const filterTime = useSelector(selectFilterTime);

    const filterTimeStart = useSelector(selectFilterTimeStart);
    const filterTimeEnd = useSelector(selectFilterTimeEnd);

    const getTranslation = (id: string) => {
        if (Object.keys(translations).includes(id)) {
            return (translations as any)[id][language] || '';
        } else {
            console.log('WARNING: One string is missing: ' + id);
            return id;
        }
    };

    useEffect(() => {}, [language]);
    return (
        <div
            id="timeline"
            className={`flex flex-row flex-none justify-between z-30 w-[46%] h-[60px] bg-white absolute bottom-[25px] m-[2%] rounded-md`}
        >
            <div
                id="epochs"
                className={`rounded-md flex-1 flex justify-center items-center
                ${filterTime == 'all' ? 'bg-mainyellow' : 'bg-white'}

                `}
            >
                <div
                    className={`bg-opacity-0 h-full flex-1 m-2 flex justify-center items-center hover:bg-mainYellowLighter cursor-pointer rounded-md
                        ${
                            filterTime == 'europe'
                                ? 'bg-mainyellow bg-opacity-100'
                                : 'bg-white'
                        }
                    `}
                    onClick={() => {
                        if (filterTime != 'europe') {
                            dispatch(setFilterTime('europe'));
                        } else {
                            dispatch(setFilterTime('all'));
                        }
                    }}
                >
                    {getTranslation('europe')}
                </div>
                <div
                    className={`bg-opacity-0 h-full flex-1 m-2 flex justify-center items-center hover:bg-mainYellowLighter cursor-pointer rounded-md
                        ${
                            filterTime == 'switzerland'
                                ? 'bg-mainyellow  bg-opacity-100'
                                : 'bg-white'
                        }
                    `}
                    onClick={() => {
                        if (filterTime != 'switzerland') {
                            dispatch(setFilterTime('switzerland'));
                        } else {
                            dispatch(setFilterTime('all'));
                        }
                    }}
                >
                    {getTranslation('switzerland')}
                </div>
                <div
                    className={`bg-opacity-0 h-full flex-1 m-2 flex justify-center items-center hover:bg-mainYellowLighter cursor-pointer rounded-md
                        ${
                            filterTime == 'southamerica'
                                ? 'bg-mainyellow bg-opacity-100'
                                : 'bg-white'
                        }
                    `}
                    onClick={() => {
                        if (filterTime != 'southamerica') {
                            dispatch(setFilterTime('southamerica'));
                        } else {
                            dispatch(setFilterTime('all'));
                        }
                    }}
                >
                    {getTranslation('southamerica')}
                </div>
                <div
                    className={`bg-opacity-0 h-full flex-1 m-2 flex justify-center items-center hover:bg-mainYellowLighter cursor-pointer rounded-md
                        ${
                            filterTime == 'europe2'
                                ? 'bg-mainyellow bg-opacity-100'
                                : 'bg-white'
                        }
                    `}
                    onClick={() => {
                        if (filterTime != 'europe2') {
                            dispatch(setFilterTime('europe2'));
                        } else {
                            dispatch(setFilterTime('all'));
                        }
                    }}
                >
                    {getTranslation('europe2')}
                </div>
            </div>
        </div>
    );
};

export default Timeline;
