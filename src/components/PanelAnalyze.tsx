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
import Chart from './Chart';

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
                id="filterTime"
                className={`rounded-xl w-full p-[5px] my-[2.5px] bg-backgroundgray  ${
                    filterTimeActive ? '' : 'opacity-50'
                }`}
            >
                <div className="flex items-center justify-between ">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="checkboxTime"
                            checked={filterTimeActive ? true : false}
                            className="w-[15px] h-[15px] m-[10px]"
                            onChange={() => {
                                dispatch(setFilterTimeActive());
                            }}
                        />

                        <div className="h-full flex items-center">
                            <img
                                src={clock}
                                className="h-[20px] px-[10px]"
                            ></img>
                            <div id="filterTimeTitle" className="font-bold">
                                {getTranslation('selectPeriod')}
                            </div>
                        </div>
                    </div>

                    <button
                        id="filterTimeClear"
                        className={`${
                            !filterTimeActive
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer'
                        }`}
                        onClick={(event: any) => {
                            dispatch(setFilterTimeStart(null));
                            dispatch(setFilterTimeEnd(null));
                            event.stopPropagation();
                        }}
                    >
                        {getTranslation('clear')}
                    </button>
                </div>
                <div id="filterTimeContainer"></div>
            </div>
            <div
                id="filterSpace"
                className={`rounded-xl w-full p-[5px] my-[2.5px] bg-backgroundgray ${
                    filterSpaceActive ? '' : 'opacity-50'
                }`}
            >
                <div className="flex items-center justify-between ">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="checkboxTime"
                            checked={filterSpaceActive ? true : false}
                            className="w-[15px] h-[15px] m-[10px]"
                            onChange={() => {
                                dispatch(setFilterSpaceActive());
                            }}
                        />

                        <div className="h-full flex items-center">
                            <img
                                src={crop}
                                className="h-[20px] px-[10px]"
                            ></img>
                            <div id="filterSpaceTitle" className="font-bold">
                                {getTranslation('selectArea')}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <Button
                            icon={penTool}
                            title=""
                            onClick={(event: any) => {
                                dispatch(
                                    setFilterSpaceDrawing(!filterSpaceDrawing)
                                );
                                event.stopPropagation();
                            }}
                            isActive={!filterSpaceDrawing}
                            isDisabled={!filterSpaceActive}
                        ></Button>
                        <button
                            id="filterSpaceClear"
                            className={`mx-[10px] ${
                                !filterSpaceActive
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'cursor-pointer'
                            }`}
                            onClick={(event: any) => {
                                dispatch(setFilterSpace(null));
                                event.stopPropagation();
                            }}
                        >
                            {getTranslation('clear')}
                        </button>
                    </div>
                </div>
            </div>
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

                    <Dropdown
                        tag="categories"
                        options={['bioQuality', 'waterQuality', 'waterToBio']}
                    />
                </div>
                <Chart />
            </div>
        </div>
    );
};

export default PanelAnalyze;
