/*
--------------
Header.tsx
--------------

UI for the Header, different buttons, dropdowns and titles

*/
import { useSelector, useDispatch } from 'react-redux';
import React, { FC, useEffect, useState } from 'react';
import { getTranslation } from '../services/languageHelper';
import PanelAnalyze from './PanelAnalyze';
import { selectSidePanelContent } from '@store/selectors';
import Button from './Button';
import { setSidePanelContent } from '@store/reducer';

import settings from './../constants/Settings.svg';
import edit from './../constants/Edit.svg';
import analyze from './../constants/pie-chart.svg';
import process2 from './../constants/refresh-cw.svg';
import print from './../constants/printer.svg';
import SidePanelHeader from './SidePanelHeader';

const SidePanel: FC<React.ComponentProps<'div'>> = () => {
    const dispatch = useDispatch();

    const sidePanelContent = useSelector(selectSidePanelContent);

    //const [content, setContent] = useState(null);

    const content: any = [];
    content.push(
        <div
            key="analyze"
            className={`${
                sidePanelContent == 'analyze' ? '' : 'hidden'
            } h-full`}
        >
            <PanelAnalyze
                active={sidePanelContent == 'analyze'}
                title="analyzeTitle"
            ></PanelAnalyze>
        </div>
    );

    // UI part
    return (
        <div
            key="sidePanel"
            id="sidePanel"
            className={`rounded-xl flex flex-col flex-none justify-between z-30 w-1/2  h-full bg-backgroundgray`}
        >
            <div
                id="handle"
                className="w-full h-[15px] flex items-center justify-center bg-backgroundgray rounded-xl"
            >
                <div
                    className="bg-white w-[70%] h-[5px] rounded-[0.75rem]"
                    onClick={() => {
                        document
                            .getElementById('sidePanel')
                            .classList.toggle('sidePanelUp');
                    }}
                ></div>
            </div>
            {content}
        </div>
    );
};

export default SidePanel;
