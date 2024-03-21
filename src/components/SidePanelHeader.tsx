/*
--------------
Header.tsx
--------------

UI for the Header, different buttons, dropdowns and titles

*/
import { useSelector, useDispatch } from 'react-redux';
import React, { FC, useEffect, useState } from 'react';
import { getTranslation } from '../services/languageHelper';
import { setSidePanelContent } from '@store/reducer';
import close from './../constants/x_white.svg';

type SidePanelHeaderProps = {
    title?: string;
    icon?: any;
};
const SidePanelHeader: FC<
    SidePanelHeaderProps & React.ComponentProps<'div'>
> = ({ title = 'Default', icon = null }) => {
    const dispatch = useDispatch();

    title = getTranslation(title);

    //const [content, setContent] = useState(null);

    const sidePanelHeader = (
        <div
            id="sidePanelHeader"
            className="rounded-t-xl w-full flex flex-row justify-between h-fit bg-projectgreen p-[5px] "
        >
            <div className="h-full flex items-center">
                <img src={icon} className="h-[20px] px-[10px]"></img>
                <div className="font-bold">{title}</div>
            </div>
            <div className="flex flex-row white">
                <img
                    className={`w-[25px] flex cursor-pointer`}
                    onClick={() => dispatch(setSidePanelContent('null'))}
                    src={close}
                ></img>
            </div>
        </div>
    );

    // UI part
    return sidePanelHeader;
};

export default SidePanelHeader;
