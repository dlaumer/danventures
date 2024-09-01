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
import { getTranslation } from '@services/languageHelper';

type PanelAnalyzeProps = {
    title?: string;
    active?: boolean;
};
const PanelAnalyze: FC<PanelAnalyzeProps & React.ComponentProps<'div'>> = ({
    title = 'Default',
    active = false,
}) => {
    const dispatch = useDispatch();

    // UI part
    return (
        <div
            id="analyze"
            className={`flex h-full grow flex-col flex-none z-30 w-full`}
        >
            <div
                id="filterChart"
                className="flex-1 h-full w-full p-[5px] bg-lighergray"
            >
                <div
                    id="chartsContainer"
                    className="flex flex-col h-full w-full"
                >
                    <ChartDistance />
                    <ChartSleeps />
                </div>
            </div>
        </div>
    );
};

export default PanelAnalyze;
