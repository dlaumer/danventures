/*
--------------
Header.tsx
--------------

UI for the Header, different buttons, dropdowns and titles

*/
import { useDispatch, useSelector } from 'react-redux';

import React, { FC } from 'react';
import { getTranslation } from '../services/languageHelper';
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
} from '@store/selectors';
import Dropdown from './Dropdown';
import Button from './Button';
import ChartDistance from './ChartDistance';

import penTool from './../constants/pen-tool.svg';
import clock from './../constants/clock.svg';
import crop from './../constants/crop.svg';
import sliders from './../constants/sliders.svg';

type PanelAnalyzeProps = {
    title?: string;
    active?: boolean;
};
const PanelAnalyze: FC<PanelAnalyzeProps & React.ComponentProps<'div'>> = ({
    title = 'Default',
    active = false,
}) => {
    title = getTranslation(title);

    const dispatch = useDispatch();
    const filterTimeActive = useSelector(selectFilterTimeActive);
    const filterSpaceActive = useSelector(selectFilterSpaceActive);
    const filterSpaceDrawing = useSelector(selectFilterSpaceDrawing);

    // UI part
    return (
        <div
            id="analyze"
            className={`flex flex-col flex-none z-30 w-full  h-full bg-white p-[5px]`}
        >
            <div
                id="filterChart"
                className="flex-1 rounded-xl w-full p-[5px] my-[2.5px] bg-backgroundgray overflow-auto"
            >
                <div className="flex items-center justify-between ">
                    <div className="h-full flex items-center">
                        <img src={sliders} className="h-[20px] px-[10px]"></img>
                        <div id="filterTopicTitle" className="font-bold">
                            {getTranslation('filterTopicTitle')}
                        </div>
                    </div>
                </div>
                <div className="w-full h-1/2">
                    <div id="chart1" className="h-full w-1/2">
                        <ChartDistance />
                    </div>
                    <div id="chart2" className="h-full w-1/2"></div>
                </div>
                <div className="w-full h-1/2">
                    <div id="chart3" className="h-full w-1/2"></div>
                    <div id="chart4" className="h-full w-1/2"></div>
                </div>
            </div>
            <div
                id="filterTime"
                className={`rounded-xl w-full p-[5px] my-[2.5px] bg-backgroundgray `}
            >
                <div className="flex items-center justify-between ">
                    <div className="h-full flex items-center">
                        <img src={clock} className="h-[20px] px-[10px]"></img>
                        <div id="filterTimeTitle" className="font-bold">
                            {getTranslation('selectPeriod')}
                        </div>
                    </div>
                </div>
                <div id="filterTimeContainer"></div>
            </div>
        </div>
    );
};

export default PanelAnalyze;
