/*
--------------
Header.tsx
--------------

UI for the Header, different buttons, dropdowns and titles

*/
import { useSelector, useDispatch } from 'react-redux';
import React, { FC, useEffect, useState } from 'react';
import { getTranslation, getTranslationStatic } from '../services/languageHelper';
import PanelAnalyze from './PanelAnalyze';
import {
    selectLanguage,
    selectLocationData,
    selectLocationPanelOpen,
    selectSidePanelContent,
    selectVisibleElements,
} from '@store/selectors';
import Button from './Button';
import {
    addVisibleElement,
    removeVisibleElement,
    setLocationPanelOpen,
    setSidePanelContent,
} from '@store/reducer';

import iconBoat from './../constants/anchor.svg';
import iconCost from './../constants/dollar-sign.svg';
import iconNights from './../constants/moon.svg';
import iconLocation from './../constants/map-pin.svg';
import iconDescription from './../constants/list.svg';
import iconPeople from './../constants/users.svg';
import iconTransport from './../constants/git-commit.svg';


import SidePanelHeader from './SidePanelHeader';
import { InView, useInView } from 'react-intersection-observer';


const LocationsPanel: FC<React.ComponentProps<'div'>> = () => {
    const dispatch = useDispatch();

    const locationData = useSelector(selectLocationData);
    const language = useSelector(selectLanguage);
    const visibleElements = useSelector(selectVisibleElements);
    const locationPanelOpen = useSelector(selectLocationPanelOpen);

    //const [content, setContent] = useState(null);
    const [content, setContent] = useState<any>(null);

    const colors: any = {
        car: '#73B2FF',
        truck: '#73DFFF',
        boat: '#FF7F7F',
        bus: '#A7C636',
        train: '#38a800',
        taxi: '#00e6a9',
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
                                let attributes = locationData[section].attributes;
                                return (
                                    <div
                                        className="bg-white"
                                        id={section}
                                        ref={ref}>
                                        <div

                                            className={`cursor-pointer relative w-full flex items-center align-center h-[50px]`}
                                            onClick={() => {
                                                if (locationPanelOpen == section) {
                                                    dispatch(setLocationPanelOpen(null))
                                                }
                                                else {
                                                    dispatch(setLocationPanelOpen(section))
                                                    setTimeout(() => {
                                                        document
                                                            .getElementById(section)
                                                            .scrollIntoView({
                                                                behavior: 'smooth',
                                                                block: 'start',
                                                                inline: 'start',
                                                            });
                                                    }, 100);

                                                }
                                            }}

                                        >
                                            <div className="absolute top-[3px] right-[3px] text-[12px]">
                                                {new Date(
                                                    parseInt(section)
                                                ).toDateString()}
                                            </div>
                                            <div className="flex w-full h-full items-center">
                                                <div
                                                    className={`z-50 ${attributes.pointType ==
                                                        'sleep'
                                                        ? 'w-[20px] h-[20px] rounded-xl m-[9px] bg-mainyellow border-solid border-bordergrey border-[1px]'
                                                        : 'w-[12px] h-[12px] rounded-xl m-[12px] bg-waypoint border-solid border-bordergrey border-[1px]'
                                                        } `}
                                                ></div>
                                                <div
                                                    style={{
                                                        width: '12px',
                                                        height: '25px',
                                                        backgroundColor:
                                                            colors[
                                                            attributes.transport
                                                            ],
                                                    }}
                                                    className={`z-30 absolute bottom-[0] left-[12px]`}
                                                ></div>
                                                <div
                                                    className={`flex items-center align-center h-full w-[calc(100%-34px)] ${attributes.pointType ==
                                                        'sleep'
                                                        ? 'bg-mainyellow'
                                                        : 'bg-backgroundgray'
                                                        } rounded-xl`}
                                                >
                                                    <div>
                                                        {
                                                            attributes.name
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`relative w-full flex items-center align-center justify-center ${locationPanelOpen == section ? '' : 'hidden'}`}
                                        >
                                            <div
                                                style={{
                                                    width: '12px',
                                                    height: '100%',
                                                    backgroundColor:
                                                        colors[
                                                        attributes.transport
                                                        ],
                                                }}
                                                className={`z-30 absolute top-0 left-[12px]`}
                                            ></div>

                                            <div className='ml-[35px] w-full'>
                                                <div className={`flex`}
                                                >
                                                    <img src={iconTransport} className="h-[30px] w-[30px] px-[5px]"></img>
                                                    <div className='flex items-center '>

                                                        <div>
                                                            {attributes.transport == 'car' || attributes.transport == 'boat' || attributes.transport == 'truck' ? getTranslationStatic(attributes.transport) + " (" + getTranslationStatic("hitchhike") + ")" : getTranslationStatic(attributes.transport)
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`flex ${attributes.transport == 'car' || attributes.transport == 'boat' || attributes.transport == 'truck' ? '' : 'hidden'}`}
                                                >
                                                    <img src={iconPeople} className="h-[30px] w-[30px] px-[5px]"></img>
                                                    <div className='flex items-center '>

                                                        <div>
                                                            {attributes.people
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`flex ${attributes.transport == 'boat' ? '' : 'hidden'}`}>
                                                    <img src={iconBoat} className="h-[30px] w-[30px] px-[5px]"></img>
                                                    <div className='flex items-center '>
                                                        <div>
                                                            {attributes.boat}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='flex'>
                                                    <img src={attributes.pointType == 'sleep' ? iconLocation : iconDescription} className="h-[30px] w-[30px] px-[5px]"></img>
                                                    <div className='flex items-center '>

                                                        <div>
                                                            {attributes.description
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`flex ${attributes.pointType == 'sleep' ? '' : 'hidden'}`}>
                                                    <img src={iconNights} className="h-[30px] w-[30px] px-[5px]"></img>
                                                    <div className='flex items-center '>
                                                        <div>
                                                            {attributes.noNights + " " + getTranslationStatic("nights")}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`flex ${attributes.transport == 'train' || attributes.transport == 'taxi' || attributes.transport == 'bus' || attributes.transport == 'rentalCar' || attributes.transport == 'ferry' || attributes.transport == 'plane' ? '' : 'hidden'}`}>
                                                    <img src={iconCost} className="h-[30px] w-[30px] px-[5px]"></img>
                                                    <div className='flex items-center '>
                                                        <div>
                                                            {attributes.travelCost + " " + getTranslationStatic("euros")}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`flex ${attributes.sleepCategory == 'hostel' || attributes.sleepCategory == 'airbnb' ? '' : 'hidden'}`}>
                                                    <img src={iconCost} className="h-[30px] w-[30px] px-[5px]"></img>
                                                    <div className='flex items-center '>
                                                        <div>
                                                            {attributes.sleepCost + " " + getTranslationStatic("euros")}
                                                        </div>
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
                                                    width: '12px',
                                                    height: 'calc(100% + 25px)',
                                                    backgroundColor:
                                                        colors[
                                                        locationData[
                                                            section
                                                        ].attributes
                                                            .transport
                                                        ],
                                                }}
                                                className={`z-30 absolute bottom-[-25px] left-[12px]`}
                                            ></div>
                                            <div className='ml-[40px]'>
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
    }, [locationData, language, locationPanelOpen]);

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
