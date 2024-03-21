/*
--------------
Header.tsx
--------------

UI for the Header, different buttons, dropdowns and titles

*/
import { useDispatch } from 'react-redux';

import React, { FC } from 'react';
import { getTranslation } from '../services/languageHelper';

type PopupProps = {
    data: any;
    type: string;
};
const Popup: FC<PopupProps & React.ComponentProps<'div'>> = ({
    data = null,
    type = 'locations',
}) => {
    if (Object.keys(data).length != 0) {
        // UI part
        let popup = null;

        if (type == 'locations') {
            popup = (
                <div
                    className={`flex flex-col flex-none justify-between z-30 w-full h-full p-[5px]`}
                >
                    <div id="name" className="mb-2">
                        <div className="font-bold">
                            {getTranslation('name') + ': '}
                        </div>
                        <div>{data.graphic.attributes['name']}</div>
                    </div>
                </div>
            );
        }

        if (type == 'tracks') {
            popup = (
                <div
                    className={`flex flex-col flex-none justify-between z-30 w-full h-full p-[5px]`}
                >
                    <div id="name" className="mb-2">
                        <div className="font-bold">
                            {getTranslation('transport') + ': '}
                        </div>
                        <div>{data.graphic.attributes['transport']}</div>
                    </div>
                </div>
            );
        }
        return popup;
    }
};

export default Popup;
