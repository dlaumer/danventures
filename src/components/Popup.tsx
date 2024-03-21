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
};
const Popup: FC<PopupProps & React.ComponentProps<'div'>> = ({
    data = null,
}) => {
    const title = getTranslation('bioQuality');
    if (Object.keys(data).length != 0) {
        console.log(data);
        // UI part
        return (
            <div
                className={`flex flex-col flex-none justify-between z-30 w-full h-full p-[5px]`}
            >
                <div id="bioWaterQuality" className="mb-2">
                    <div className="font-bold">
                        {getTranslation('bioWaterQuality') + ': '}
                    </div>
                    <div>
                        {getTranslation(
                            data.graphic.attributes['BioWaterQuality']
                        )}
                    </div>
                </div>

                <div id="landscapeEcology" className="mb-2">
                    <div className="font-bold">
                        {getTranslation('landscapeEcology') + ': '}
                    </div>
                    <div>
                        {getTranslation(
                            data.graphic.attributes['LandscapeEcology']
                        )}
                    </div>
                    <div>
                        {getTranslation('value') +
                            ': ' +
                            data.graphic.attributes['landscape_eco_number']}
                    </div>
                </div>

                <div id="physioChemicalProperties" className="mb-2">
                    <div className="font-bold">
                        {getTranslation('physioChemicalProperties') + ': '}
                    </div>
                    <table>
                        <tbody>
                            <tr key="waterTemperature">
                                <td>
                                    {getTranslation('waterTemperature') + ':'}
                                </td>
                                <td>{data.graphic.attributes['water_temp']}</td>
                            </tr>
                            <tr key="oxygen">
                                <td>{getTranslation('oxygen') + ':'}</td>
                                <td>{data.graphic.attributes['water_O2']}</td>
                            </tr>
                            <tr key="nitrate">
                                <td>{getTranslation('nitrate') + ':'}</td>
                                <td>{data.graphic.attributes['water_nitr']}</td>
                            </tr>
                            <tr key="conductivity">
                                <td>{getTranslation('conductivity') + ':'}</td>
                                <td>{data.graphic.attributes['water_cond']}</td>
                            </tr>
                            <tr key="ph">
                                <td>{getTranslation('ph') + ':'}</td>
                                <td>{data.graphic.attributes['water_ph']}</td>
                            </tr>
                            <tr key="alkalinity">
                                <td>{getTranslation('alkalinity') + ':'}</td>
                                <td>{data.graphic.attributes['water_alka']}</td>
                            </tr>
                            <tr key="flowVelocity">
                                <td>{getTranslation('flowVelocity') + ':'}</td>
                                <td>{data.graphic.attributes['water_turb']}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div id="remarks" className="mb-2">
                    <div className="font-bold">
                        {getTranslation('remarks') + ': '}
                    </div>
                    <div>{data.graphic.attributes['comments']}</div>
                </div>
            </div>
        );
    }
};

export default Popup;
