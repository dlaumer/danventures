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
import {
    selectLanguage,
    selectLocationData,
    selectSidePanelContent,
    selectVisibleElements,
} from '@store/selectors';
import Button from './Button';
import {
    addVisibleElement,
    removeVisibleElement,
    setSidePanelContent,
} from '@store/reducer';

import settings from './../constants/Settings.svg';
import edit from './../constants/Edit.svg';
import analyze from './../constants/pie-chart.svg';
import process2 from './../constants/refresh-cw.svg';
import print from './../constants/printer.svg';
import SidePanelHeader from './SidePanelHeader';
import { InView, useInView } from 'react-intersection-observer';

const LocationsPanel: FC<React.ComponentProps<'div'>> = () => {
    const dispatch = useDispatch();

    const locationData = useSelector(selectLocationData);
    const language = useSelector(selectLanguage);
    const visibleElements = useSelector(selectVisibleElements);

    //const [content, setContent] = useState(null);
    const [content, setContent] = useState<any>(null);

    const colors: any = {
        car: '#73B2FF',
        truck: '#73DFFF',
        boat: '#FF7F7F',
        bus: '#A7C636',
        train: '#38a800',
        ferry: '#FFAA00',
        foot: '#C500FF',
        rentalCar: '#FFFF00',
        plane: '#000000',
    };

    const { ref, inView } = useInView({
        threshold: 0.2,
    });

    // callback called when a section is in view
    const setInView = (inView: any, entry: any) => {
        if (entry.target.getAttribute('id') != null) {
            const index = parseInt(entry.target.getAttribute('id'));
            if (inView) {
                dispatch(addVisibleElement(index));
            } else {
                dispatch(removeVisibleElement(index));
            }
        }
    };

    function distanceToPixel(distance: number) {
        // Limiting the distance between 0 and 1200 km
        distance = Math.max(0, Math.min(1200, distance));

        // Logarithmic mapping
        // Adjusting the range to match the desired pixel size range (50 to 200)
        const pixelSize =
            20 + (100 * Math.log10(distance + 1)) / Math.log10(1201);

        // Rounding the pixel size to the nearest integer
        return Math.round(pixelSize);
    }

    useEffect(() => {
        if (locationData != null) {
            const seqsTemp = Object.keys(locationData);
            const seqs = seqsTemp.sort((a, b) => b.localeCompare(a));

            // Section wrapper
            setContent(
                <div id="section-wrapper" ref={ref}>
                    {seqs.map((section) => (
                        <InView
                            onChange={setInView}
                            threshold={0.8}
                            key={section}
                        >
                            {({ ref }) => {
                                return (
                                    <div className="bg-white">
                                        <div
                                            id={section}
                                            ref={ref}
                                            className={`relative w-full flex items-center align-center w-full h-[50px]`}
                                        >
                                            <div className="absolute top-[3px] right-[3px] text-[10px]">
                                                {new Date(
                                                    parseInt(section)
                                                ).toDateString()}
                                            </div>
                                            <div className="flex w-full h-full ">
                                                <div
                                                    className={`z-50 ${
                                                        locationData[section]
                                                            .attributes
                                                            .pointType ==
                                                        'sleep'
                                                            ? 'w-[15px] h-[15px] rounded-xl m-[9px] bg-mainyellow border-solid border-bordergrey border-[1px]'
                                                            : 'w-[8px] h-[8px] rounded-xl m-[12px] bg-waypoint border-solid border-bordergrey border-[1px]'
                                                    } `}
                                                ></div>
                                                <div
                                                    className={`flex items-center align-center h-full w-[calc(100%-34px)] ${
                                                        locationData[section]
                                                            .attributes
                                                            .pointType ==
                                                        'sleep'
                                                            ? 'bg-mainyellow'
                                                            : 'bg-backgroundgray'
                                                    } rounded-xl`}
                                                >
                                                    <div>
                                                        {
                                                            locationData[
                                                                section
                                                            ].attributes.name
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                height:
                                                    distanceToPixel(
                                                        locationData[section]
                                                            .distance
                                                    ).toString() + 'px',
                                            }}
                                            className="relative w-full flex items-center align-center justify-center"
                                        >
                                            <div
                                                style={{
                                                    width: '8px',
                                                    height:
                                                        (
                                                            distanceToPixel(
                                                                locationData[
                                                                    section
                                                                ].distance
                                                            ) + 50
                                                        ).toString() + 'px',
                                                    backgroundColor:
                                                        colors[
                                                            locationData[
                                                                section
                                                            ].attributes
                                                                .transport
                                                        ],
                                                }}
                                                className={`z-30 absolute top-[-25px] left-[12px]`}
                                            ></div>
                                            <div>
                                                {locationData[section]
                                                    .distance + ' km'}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }}
                        </InView>
                    ))}
                </div>
            );
        }
    }, [locationData, language]);

    // UI part
    return (
        <div
            key="locationsPanel"
            id="locationsPanel"
            className={`flex flex-col flex-none justify-between z-30 w-1/4  h-full overflow-scroll`}
        >
            <div className="h-full w-full bg-lighergray">{content}</div>
        </div>
    );
};

export default LocationsPanel;
