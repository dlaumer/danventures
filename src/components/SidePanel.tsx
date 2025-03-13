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

    // UI part
    return (
        <div
            key="sidePanel"
            id="sidePanel"
            className={`rounded-xl flex flex-col flex-none justify-between z-30 w-1/2 h-full`}
        >
            <PanelAnalyze
                active={sidePanelContent == 'analyze'}
                title="analyzeTitle"
            ></PanelAnalyze>
        </div>
    );
};

export default SidePanel;
