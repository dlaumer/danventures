/*
--------------
Header.tsx
--------------

UI for the Header, different buttons, dropdowns and titles

*/
import { useSelector, useDispatch } from 'react-redux';
import React, { FC, useEffect, useState } from 'react';

import { getTranslation } from '@services/languageHelper';
import close from './../constants/x_black.svg';

const MobileInfo: FC<React.ComponentProps<'div'>> = () => {
    const dispatch = useDispatch();

    const [mobileInfoOpen, setMobileInfoOpen] = useState(true);
    const mobileInfo = getTranslation('mobileInfo');

    // UI part
    return (
        <div
            id={'mobileInfo'}
            className={`${
                mobileInfoOpen ? '' : '!hidden'
            } absolute top-0 w-full bg-black bg-opacity-50 h-full z-[100]`}
        >
            <div className="absolute left-[calc(50%-175px)] top-[calc(50%-175px)] h-[350px] w-[350px] bg-backgroundgray p-3 overflow-auto pointer-events-auto">
                <div className="flex flex-row justify-end w-full h-[10%]">
                    <button
                        className="top-2 right-2"
                        onClick={() => {
                            setMobileInfoOpen(false);
                        }}
                    >
                        <img className={`w-[25px] flex`} src={close}></img>
                    </button>
                </div>
                <div className="flex w-full h-[90%] py-3">
                    <div>{mobileInfo}</div>
                </div>
            </div>
        </div>
    );
};

export default MobileInfo;
