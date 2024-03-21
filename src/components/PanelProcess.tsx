/*
--------------
Header.tsx
--------------

UI for the Header, different buttons, dropdowns and titles

*/
import { useDispatch, useSelector } from 'react-redux';

import React, { FC } from 'react';
import { getTranslation } from '../services/languageHelper';
import Button from './Button';
import { selectIsLoggedIn } from '@store/selectors';

type PanelProcessProps = {
    title?: string;
    active?: boolean;
};
const PanelProcess: FC<PanelProcessProps & React.ComponentProps<'div'>> = ({
    title = 'Default',
    active = false,
}) => {
    const dispatch = useDispatch();
    const text = getTranslation('processInfoText');
    const isLoggedIn = useSelector(selectIsLoggedIn);

    // UI part
    return (
        <div
            id={title}
            className={`flex flex-col flex-none justify-between z-30 w-full  h-full bg-white p-[5px]`}
        >
            <div id="processInfoText" className="p-2">
                {text}
            </div>
            <div className="p-2 flex flex-col items-center">
                <div className="m-2">
                    <Button
                        titleKey="openMapViewer"
                        onClick={() => {
                            const url = isLoggedIn
                                ? 'https://globe-swiss.maps.arcgis.com/apps/mapviewer/index.html?layers=665046b6489f4feaa1e25b379cb3f70c'
                                : 'https://globe-swiss.maps.arcgis.com/apps/mapviewer/index.html?layers=014ebd4120354d9bb3795be9276b40b9';
                            window.open(url, '_blank');
                        }}
                    ></Button>
                </div>
                <div className="m-2">
                    <Button
                        titleKey="openSceneViewer"
                        onClick={() => {
                            const url = isLoggedIn
                                ? 'https://globe-swiss.maps.arcgis.com/home/webscene/viewer.html?layers=665046b6489f4feaa1e25b379cb3f70c'
                                : 'https://globe-swiss.maps.arcgis.com/home/webscene/viewer.html?layers=014ebd4120354d9bb3795be9276b40b9';
                            window.open(url, '_blank');
                        }}
                    ></Button>
                </div>
            </div>
        </div>
    );
};

export default PanelProcess;
