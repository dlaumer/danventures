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

    {
        /* At the top */
    }

    {
        /* Within the component */
    }
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

    useEffect(() => {
        if (locationData != null) {
            const seqs = Object.keys(locationData);
            seqs.sort((a: any, b: any) => b - a);

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
                                    <div
                                        id={section}
                                        ref={ref}
                                        className="w-full h-fit bg-backgroundgray rounded-xl"
                                    >
                                        {section +
                                            ', ' +
                                            locationData[section].attributes
                                                .name}
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
            key="locationPanel"
            id="locationPanel"
            className={`flex flex-col flex-none justify-between z-30 w-1/4  h-full bg-lighergray overflow-scroll`}
        >
            {content}
        </div>
    );
};

export default LocationsPanel;
