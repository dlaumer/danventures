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

const Header = () => {
    const dispatch = useDispatch();
    // UI part

    const settingsOpen = useSelector(selectSettingsOpen);
    const calculateTracksActive = useSelector(selectCalculateTracksActive);

    const [buttons, setButtons] = useState(null);
    const [loginButton, setLoginButton] = useState(null);

    return (
        <div
            id="header"
            className="absolute flex flex-row flex-none justify-between z-30 w-full h-[60px] py-1 bg-headergreen px-[15px]"
        >
            <div className="h-full flex flex-row items-center gap-2 mr-4 font-noigrotesk">
                <div>
                    <div className="leading-snug text-base font-bold">
                        {getTranslation('title')}
                    </div>
                    <div className="leading-snug text-xs font-bold">
                        {getTranslation('subTitle')}
                    </div>
                </div>
                <Button
                    titleKey="calculateTracksActive"
                    onClick={() => dispatch(setCalculateTracksActive(true))}
                    isActive={calculateTracksActive}
                ></Button>

                {buttons}
            </div>
            <div className="flex flex-row h-full items-center gap-2 mr-4 font-noigrotesk">
                <div className="flex flex-row h-[80%] items-center gap-2 font-noigrotesk">
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
