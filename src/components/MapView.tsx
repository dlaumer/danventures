import React, { useEffect, useState, useRef } from 'react';
import ReactDOMServer, { renderToString } from 'react-dom/server';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@store/configureStore';

import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import TimeSlider from '@arcgis/core/widgets/TimeSlider';
import TimeInterval from '@arcgis/core/TimeInterval';
import Home from '@arcgis/core/widgets/Home';
import AreaMeasurement2D from '@arcgis/core/widgets/AreaMeasurement2D';
import Compass from '@arcgis/core/widgets/Compass';
import DistanceMeasurement2D from '@arcgis/core/widgets/DistanceMeasurement2D';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import Expand from '@arcgis/core/widgets/Expand';
import Locate from '@arcgis/core/widgets/Locate';
import Legend from '@arcgis/core/widgets/Legend';
import LayerList from '@arcgis/core/widgets/LayerList';
import ElevationProfile from '@arcgis/core/widgets/ElevationProfile';
import Editor from '@arcgis/core/widgets/Editor';
import Search from '@arcgis/core/widgets/Search';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils.js';
import esriId from '@arcgis/core/identity/IdentityManager';
import OAuthInfo from '@arcgis/core/identity/OAuthInfo';
import ServerInfo from '@arcgis/core/identity/ServerInfo';
import PortalItem from '@arcgis/core/portal/PortalItem';
import esriConfig from '@arcgis/core/config';
import Portal from '@arcgis/core/portal/Portal';
import Sketch from '@arcgis/core/widgets/Sketch';
import Query from '@arcgis/core/rest/support/Query';
import Color from '@arcgis/core/Color';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import TimeExtent from '@arcgis/core/TimeExtent';
import FeatureEffect from '@arcgis/core/layers/support/FeatureEffect';
import FeatureFilter from '@arcgis/core/layers/support/FeatureFilter';
import Print from '@arcgis/core/widgets/Print';
import FeatureTemplate from '@arcgis/core/rest/route';
import * as route from '@arcgis/core/rest/route';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import Graphic from '@arcgis/core/Graphic';
import Polyline from '@arcgis/core/geometry/Polyline';
import ComboBoxInput from '@arcgis/core/form/elements/inputs/ComboBoxInput';
import CodedValueDomain from '@arcgis/core/layers/support/CodedValueDomain';

import {
    selectAttribute,
    selectCalculateTracksActive,
    selectCategory,
    selectFilterSpace,
    selectFilterSpaceActive,
    selectFilterSpaceDrawing,
    selectFilterTime,
    selectFilterTimeActive,
    selectFilterTimeEnd,
    selectFilterTimeStart,
    selectHoverFeatures,
    selectIsLoggedIn,
    selectLanguage,
    selectLogInAttempt,
    selectSidePanelContent,
} from '@store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import {
    addFilterSpace,
    setAttribute,
    setCalculateTracksActive,
    setFeatures,
    setFilterSpace,
    setFilterSpaceDrawing,
    setFilterTime,
    setFilterTimeEnd,
    setFilterTimeStart,
    setGeneralNumbers,
    setIsLoggedIn,
    setLogInAttempt,
    setSleepCategories,
    setUsernameEsri,
} from '@store/reducer';
import { getTranslation, getTranslationStatic } from '@services/languageHelper';
import Popup from './Popup';
import { createRoot } from 'react-dom/client';

interface Props {
    /**
     * all child element will receive the mapView as one of it's properties
     */
    children?: React.ReactNode;
}

const ArcGISMapView: React.FC<Props> = ({ children }: Props) => {
    const dispatch = useDispatch();

    const mapDivRef = useRef<HTMLDivElement>();

    const [mapView, setMapView] = useState<MapView>(null);
    const [timeSlider, setTimeSlider] = useState<TimeSlider>(null);
    const [editor, setEditor] = useState<Editor>(null);
    const [print, setPrint] = useState<Print>(null);

    const language = useSelector(selectLanguage);
    const calculateTracksActive = useSelector(selectCalculateTracksActive);
    const hoverFeatures = useSelector(selectHoverFeatures);
    const attribute = useSelector(selectAttribute);

    const [locations, setLocations] = useState<FeatureLayer>(null);
    const [sleeps, setSleeps] = useState<FeatureLayer>(null);
    const [tracks, setTracks] = useState<FeatureLayer>(null);

    const [locationsData, setLocationsData] = useState<any>(null);

    const locationsId = '2fdef304971d4357a6f5f31535e32ac8';
    const tracksId = '3c6cc36205ea46afb38bf901c1147784';

    // Point the URL to a valid routing service
    const routeUrl =
        'https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World';

    // The stops and route result will be stored in this layer
    const routeLayer = new GraphicsLayer();

    // Define the symbology used to display the route
    const routeSymbol = {
        type: 'simple-line', // autocasts as SimpleLineSymbol()
        color: [0, 0, 255, 0.5],
        width: 5,
    };

    const actualDate = new Date();
    const fullTimeExtent = new TimeExtent({
        start: new Date(2023, 1, 1),
        end: actualDate,
    });

    let isInitalizing = false;

    const initMapView = () => {
        /////// BASIC MAP ELEMENTS /////////////////////////////////////////////////////////
        // Map instance, holds the layers and the basemap definition
        const map = new Map({
            /* basemap:new Basemap({
                 portalItem: {
                     id: "0560e29930dc4d5ebeb58c635c0909c9"
                 }
             }),
             */
            basemap: 'topo-vector',
            ground: 'world-elevation',
        });

        const templateLocations = new PopupTemplate({
            title: '{name}',
            content: setContentInfoLocations,
        });

        const templateTracks = new PopupTemplate({
            title: '{nameFrom} - {nameTo}',
            content: setContentInfoTracks,
        });
        // The view instance is the most important instance for ArcGIS, from here you can access almost all elements like layers, ui elements, widget, etc
        const view = new MapView({
            popupEnabled: true,
            container: mapDivRef.current,
            map: map,
            center: [-10, 30],
            zoom: 4,
        });

        const rendererLocations: any = {
            type: 'unique-value', // autocasts as new UniqueValueRenderer()
            field: 'pointType',
            defaultSymbol: {
                type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
                style: 'circle',
                size: 6, // pixels
                outline: {
                    // autocasts as new SimpleLineSymbol()
                    color: [153, 153, 153, 64],
                    width: 0.75, // points
                },
                color: [170, 170, 170, 255],
            }, // autocasts as new SimpleFillSymbol()
            uniqueValueInfos: [
                {
                    // All features with value of "North" will be blue
                    value: 'waypoint',
                    symbol: {
                        type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
                        style: 'circle',
                        size: 3, // pixels
                        outline: {
                            // autocasts as new SimpleLineSymbol()
                            color: [153, 153, 153, 64],
                            width: 0.5, // points
                        },
                        color: [155, 0, 0, 255],
                    },
                },
                {
                    // All features with value of "East" will be green
                    value: 'sleep',
                    symbol: {
                        type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
                        style: 'circle',
                        size: 10, // pixels
                        outline: {
                            // autocasts as new SimpleLineSymbol()
                            color: [153, 153, 153, 64],
                            width: 0.75, // points
                        },
                        color: [255, 255, 0, 255],
                    },
                },
            ],
        };

        const rendererTracks: any = {
            type: 'unique-value', // autocasts as new UniqueValueRenderer()
            field: 'transport',
            defaultSymbol: {
                type: 'simple-line', // autocasts as new SimpleMarkerSymbol()
                width: '5px',
                color: [225, 225, 225, 255],
            }, // autocasts as new SimpleFillSymbol()
            uniqueValueInfos: [
                {
                    // All features with value of "North" will be blue
                    value: 'car',
                    symbol: {
                        type: 'simple-line', // autocasts as new SimpleMarkerSymbol()
                        width: '5px',
                        color: [255, 0, 0, 255],
                    },
                },
                {
                    // All features with value of "North" will be blue
                    value: 'boat',
                    symbol: {
                        type: 'simple-line', // autocasts as new SimpleMarkerSymbol()
                        width: '5px',
                        color: [255, 225, 0, 255],
                    },
                },
            ],
        };

        const categoryExpressionInfos = [
            {
                name: 'category-sleep',
                expression: "$feature.pointType == 'sleep'",
            },
            {
                name: 'transport-boat',
                expression: "$feature.transport == 'boat'",
            },
        ];
        const formTemplate = {
            // Autocasts to new FormTemplate
            elements: [
                {
                    // Autocasts to new FieldElement
                    type: 'field',
                    fieldName: 'pointType',
                    label: getTranslationStatic('pointType'),
                },
                {
                    // Autocasts to new FieldElement
                    type: 'field',
                    fieldName: 'name',
                    label: getTranslationStatic('name'),
                },
                {
                    // Autocasts to new FieldElement
                    type: 'field',
                    fieldName: 'transport',
                    label: getTranslationStatic('transport'),
                },
                {
                    // Autocasts to new FieldElement
                    type: 'field',
                    fieldName: 'boat',
                    label: getTranslationStatic('boat'),
                    visibilityExpression: 'transport-boat',
                },
                {
                    // Autocasts to new FieldElement
                    type: 'field',
                    fieldName: 'travel_date',
                    label: getTranslationStatic('travel_date'),
                },
                {
                    // Autocasts to new FieldElement
                    type: 'field',
                    fieldName: 'people',
                    label: getTranslationStatic('people'),
                },
                {
                    // Autocasts to new FieldElement
                    type: 'field',
                    fieldName: 'description',
                    label: getTranslationStatic('description'),
                },
                {
                    // Autocasts to new FieldElement
                    type: 'field',
                    fieldName: 'sleepCategory',
                    label: getTranslationStatic('sleepCategory'),
                    visibilityExpression: 'category-sleep',
                },
                {
                    // Autocasts to new FieldElement
                    type: 'field',
                    fieldName: 'noNights',
                    label: getTranslationStatic('noNights'),
                    visibilityExpression: 'category-sleep',
                },
            ],
            expressionInfos: categoryExpressionInfos,
        }; // end of form template elements

        const tracksLayer = new FeatureLayer({
            portalItem: {
                id: tracksId,
            },
            //renderer: rendererTracks,
            outFields: ['*'],
            title: getTranslationStatic('tracks'),
            editingEnabled: false,
        });

        view.map.add(tracksLayer);

        const locationsLayer = new FeatureLayer({
            portalItem: {
                id: locationsId,
            },
            //renderer: rendererLocations,
            outFields: ['*'],
            definitionExpression: "pointType <> 'sleep'",
            popupEnabled: false,
            title: getTranslationStatic('locations'),
            legendEnabled: false,
            formTemplate: formTemplate,
        });

        view.map.add(locationsLayer);

        const sleepsLayer = new FeatureLayer({
            portalItem: {
                id: locationsId,
            },
            definitionExpression: "pointType = 'sleep'",
            popupEnabled: true,
            title: getTranslationStatic('sleeps'),
            editingEnabled: false,
        });

        view.map.add(sleepsLayer);

        setLocations(locationsLayer);
        setSleeps(sleepsLayer);
        setTracks(tracksLayer);

        //locationsLayer.popupTemplate = templateLocations;
        //tracksLayer.popupTemplate = templateTracks;

        const slider = new TimeSlider({
            view: view,
            mode: 'cumulative-from-start',
            fullTimeExtent: {
                start: new Date(2023, 8, 27),
                end: actualDate,
            },
            timeExtent: {
                start: null,
                end: actualDate,
            },
            stops: {
                interval: new TimeInterval({
                    value: 1,
                    unit: 'days',
                }),
            },
        });

        setTimeSlider(slider);
        //dispatch(setFilterTimeStart(slider.timeExtent.start));
        //dispatch(setFilterTimeEnd(slider.timeExtent.end));

        //view.ui.add(timeSlider, 'bottom-left');

        const compass = new Compass({
            view: view,
        });
        view.ui.add(compass, 'top-left');

        const home = new Home({
            view: view,
        });
        view.ui.add(home, 'top-left');

        const locate = new Locate({
            view: view,
        });
        view.ui.add(locate, 'top-left');

        const search = new Expand({
            view: view,
            content: new Search({
                view: view,
            }),
            group: 'top-right',
        });

        view.ui.add(search, 'top-right');

        const editor = new Expand({
            view: view,
            content: new Editor({
                view: view,
            }),
            group: 'top-right',
        });

        view.ui.add(editor, 'top-right');

        const leg = new Legend({
            view: view,
        });
        const legend = new Expand({
            view: view,
            expandTooltip: getTranslationStatic('legend'),
            collapseTooltip: getTranslationStatic('legend'),
            content: leg,
            group: 'top-right',
        });
        view.ui.add(legend, 'top-right');

        const layList = new LayerList({
            view: view,
        });
        const layerList = new Expand({
            view: view,
            expandTooltip: getTranslationStatic('layerList'),
            collapseTooltip: getTranslationStatic('layerList'),
            content: layList,
            group: 'top-right',
        });
        view.ui.add(layerList, 'top-right');

        const basemapGallery = new Expand({
            view: view,
            expandTooltip: getTranslationStatic('basemap'),
            collapseTooltip: getTranslationStatic('basemap'),
            content: new BasemapGallery({
                view: view,
            }),
            group: 'top-right',
        });
        view.ui.add(basemapGallery, 'top-right');

        const measure = new Expand({
            view: view,
            expandTooltip: getTranslationStatic('measureDistance'),
            collapseTooltip: getTranslationStatic('measureDistance'),
            content: new DistanceMeasurement2D({
                view: view,
            }),
            group: 'top-right',
        });
        view.ui.add(measure, 'top-right');

        const measureArea = new Expand({
            view: view,
            expandTooltip: getTranslationStatic('measureArea'),
            collapseTooltip: getTranslationStatic('measureArea'),
            content: new AreaMeasurement2D({
                view: view,
            }),
            group: 'top-right',
        });
        view.ui.add(measureArea, 'top-right');

        const elevatonProfile = new Expand({
            view: view,
            expandTooltip: getTranslationStatic('elevationProfile'),
            collapseTooltip: getTranslationStatic('elevationProfile'),
            content: new ElevationProfile({
                view: view,
            }),
            group: 'top-right',
        });
        view.ui.add(elevatonProfile, 'top-right');

        // Remove all ui elements, so that they can be added manually as tools!
        //view.ui.components = ["attribution"];
        //view.ui.components = [];

        view.when(() => {
            setMapView(view);
            slider.container = 'filterTimeContainer';

            slider.when(() => {
                const timeSliderFooter = document.getElementsByClassName(
                    'esri-time-slider__min'
                )[0].parentNode;
                (timeSliderFooter as HTMLElement).style.display = 'none';
                document.getElementById('filterTimeContainer').onclick =
                    function (event) {
                        event.stopPropagation();
                    };
            });

            // Your event handler function
            const handleSliderChange = (value: any) => {
                // Your logic here, e.g., calling the backend
                queryDistances(view, tracksLayer);
                querySleeps(view, locationsLayer);
                queryGeneralNumbers(view, tracksLayer, locationsLayer);
            };

            // Set up a debounced version of your event handler
            const debouncedSliderHandler = debounce(handleSliderChange, 500); // Adjust the delay as needed (500 milliseconds in this example)

            slider.watch('timeExtent', (value: any) => {
                // update layer view filter to reflect current timeExtent
                debouncedSliderHandler(value.start);
                debouncedSliderHandler(value.end);
            });

            queryDistances(view, tracksLayer);
            querySleeps(view, locationsLayer);
            queryGeneralNumbers(view, tracksLayer, locationsLayer);

            //view.goTo(locationsLayer.fullExtent);
        });

        reactiveUtils.whenOnce(() => !view.updating).then(() => {});
        // Function block the UI while the map is loading!
    };

    const setContentInfoLocations = (feature: any) => {
        // Create a container element for React to render into
        const container = document.createElement('div');
        const root = createRoot(container); // createRoot(container!) if you use TypeScript
        // Render your React component into the container
        root.render(
            <ReduxProvider store={store}>
                <Popup data={feature} type="locations"></Popup>
            </ReduxProvider>
        );

        // Return the container element
        return container;
    };

    const setContentInfoTracks = (feature: any) => {
        // Create a container element for React to render into
        const container = document.createElement('div');
        const root = createRoot(container); // createRoot(container!) if you use TypeScript
        // Render your React component into the container
        root.render(
            <ReduxProvider store={store}>
                <Popup data={feature} type="tracks"></Popup>
            </ReduxProvider>
        );

        // Return the container element
        return container;
    };

    const checkTracks = (from: string, to: string, view: MapView) => {
        if (view != null) {
            const myPromise: Promise<string> = new Promise(
                (resolve, reject) => {
                    const query: any = {
                        //where: `EXTRACT(MONTH FROM ${layer.timeInfo.startField}) = ${month}`,
                        where:
                            "indexFrom= '" +
                            from +
                            "' AND indexTo= '" +
                            to +
                            "'",
                        returnGeometry: false,
                        maxRecordCountFactor: 2,
                        outFields: ['*'],
                    };

                    // Perform the query on the feature layer
                    tracks
                        .queryFeatures(query)
                        .then(function (result: any) {
                            if (result.features.length > 0) {
                                console.log('Track exists');
                            } else {
                                console.log(`Track does not exist`);
                                resolve('Resolved');
                            }
                        })
                        .catch(function (error: any) {
                            console.error(`Query failed: `, error);
                        });
                }
            );
            return myPromise;
        }
    };

    const queryGeneralNumbers = (
        view: MapView,
        tracksLayer: FeatureLayer,
        locationsLayer: FeatureLayer
    ) => {
        if (view != null) {
            const myPromise: Promise<string> = new Promise(
                (resolve, reject) => {
                    const promises = [];
                    const query: any = {
                        where: `1=1`,
                        returnGeometry: false,
                        outStatistics: [
                            {
                                statisticType: 'sum',
                                onStatisticField: 'Shape__length',
                                outStatisticFieldName: 'sumLength',
                            },
                        ],
                        timeExtent: view.timeExtent,
                    };

                    promises.push(queryLayer(tracksLayer, query));

                    const query2: any = {
                        where: `1=1`,
                        returnGeometry: false,
                        outStatistics: [
                            {
                                statisticType: 'sum',
                                onStatisticField: 'noNights',
                                outStatisticFieldName: 'countSleeps',
                            },
                        ],
                        timeExtent: view.timeExtent,
                    };

                    promises.push(queryLayer(locationsLayer, query2));

                    const query3: any = {
                        where: `transport = 'car' OR transport = 'truck' OR transport = 'boat'`,
                        returnGeometry: false,
                        outStatistics: [
                            {
                                statisticType: 'count',
                                onStatisticField: 'transport',
                                outStatisticFieldName: 'countTransports',
                            },
                        ],
                        timeExtent: view.timeExtent,
                    };

                    promises.push(queryLayer(locationsLayer, query3));

                    const query4: any = {
                        where: `1=1`,
                        returnGeometry: false,
                        outFields: ['travel_date'],
                        timeExtent: view.timeExtent,
                    };

                    promises.push(queryLayer(locationsLayer, query4));

                    Promise.all(promises).then((results) => {
                        const uniqueDays = new Set();
                        results[3].features.forEach(function (feature: any) {
                            const dateValue = new Date(
                                feature.attributes.travel_date
                            );
                            const day = dateValue.getDate();
                            const month = dateValue.getMonth();
                            const year = dateValue.getFullYear();
                            const uniqueDate = new Date(year, month, day)
                                .toISOString()
                                .split('T')[0]; // Keep only the date part
                            uniqueDays.add(uniqueDate);
                        });

                        // Count unique days
                        const uniqueDaysCount = uniqueDays.size;
                        const numbers: any = {
                            totalDistance: Math.round(
                                (results[0].features[0].attributes[
                                    'sumLength'
                                ] *
                                    0.9144) /
                                    1000
                            ),
                            totalDays:
                                results[1].features[0].attributes[
                                    'countSleeps'
                                ],
                            totalRides:
                                results[2].features[0].attributes[
                                    'countTransports'
                                ],
                            totalTravelDays: uniqueDaysCount,
                        };
                        dispatch(setGeneralNumbers(numbers));
                        resolve('Resolved');
                    });
                }
            );
            return myPromise;
        }
    };

    const queryDistances = (view: MapView, tracksLayer: FeatureLayer) => {
        if (view != null) {
            const myPromise: Promise<string> = new Promise(
                (resolve, reject) => {
                    const query: any = {
                        //where: `EXTRACT(MONTH FROM ${layer.timeInfo.startField}) = ${month}`,
                        where: `1=1`,
                        returnGeometry: false,
                        outStatistics: [
                            {
                                statisticType: 'sum',
                                onStatisticField: 'Shape__length',
                                outStatisticFieldName: 'sumLength',
                            },
                        ],
                        groupByFieldsForStatistics: [`transport`],
                        orderByFields: [`sumLength DESC`],
                        timeExtent: view.timeExtent,
                    };

                    queryLayer(tracksLayer, query).then((result: any) => {
                        dispatch(setFeatures(result.features));
                    });
                    // Perform the query on the feature layer
                }
            );
            return myPromise;
        }
    };

    const querySleeps = (view: MapView, locationLayer: FeatureLayer) => {
        if (view != null) {
            const myPromise: Promise<string> = new Promise(
                (resolve, reject) => {
                    const query: any = {
                        //where: `EXTRACT(MONTH FROM ${layer.timeInfo.startField}) = ${month}`,
                        where: `1=1`,
                        returnGeometry: false,
                        outStatistics: [
                            {
                                statisticType: 'sum',
                                onStatisticField: 'noNights',
                                outStatisticFieldName: 'countSleeps',
                            },
                        ],
                        groupByFieldsForStatistics: [`sleepCategory`],
                        orderByFields: [`countSleeps DESC`],
                        timeExtent: view.timeExtent,
                    };

                    queryLayer(locationLayer, query).then((result: any) => {
                        dispatch(setSleepCategories(result.features));
                    });
                }
            );
            return myPromise;
        }
    };

    const queryLocations = (view: MapView) => {
        if (view != null) {
            // Get the correct layer

            const query: any = {
                //where: `EXTRACT(MONTH FROM ${layer.timeInfo.startField}) = ${month}`,
                where: `1=1`,
                returnGeometry: true,
                outFields: ['*'],
                maxRecordCountFactor: 2,
            };

            queryLayer(locations, query)
                .then((result: any) => {
                    calculateTracks(result.features);
                    dispatch(setCalculateTracksActive(false));
                })
                .catch((error: any) => {
                    dispatch(setCalculateTracksActive(false));
                });
        }
    };

    const addTrack = (from: any, to: any, track: any) => {
        const myPromise: Promise<string> = new Promise((resolve, reject) => {
            const attributes: any = {
                indexFrom: from.attributes.travel_date,
                indexTo: to.attributes.travel_date,
                transport: to.attributes.transport,
                nameFrom: from.attributes.name,
                nameTo: to.attributes.name,
                travel_date: to.attributes.travel_date,
                boat: to.attributes.boat,
            };

            if (to.attributes.pointType != 'sleep') {
                attributes['people'] = to.attributes.people;
                attributes['description'] = to.attributes.description;
            } else {
                console.log('Wuhu');
            }

            const addFeature = new Graphic({
                geometry: track,
                attributes: attributes,
            });
            // Apply uploading the (almost) empty row
            const promise = tracks
                .applyEdits({
                    addFeatures: [addFeature],
                })
                .then((editInfo) => {
                    if (editInfo.addFeatureResults[0].objectId != -1) {
                        console.log(editInfo);
                        resolve('resolved');
                    } else {
                        alert(
                            'loading not possible: ' +
                                editInfo.addFeatureResults[0].error.message
                        );
                        console.error(editInfo.addFeatureResults[0].error);
                    }
                });
        });

        return myPromise;
    };

    const queryLayer: any = (layer: FeatureLayer, query: Query) => {
        const promise: Promise<string> = new Promise((resolve, reject) => {
            // Perform the query on the feature layer
            layer
                .queryFeatures(query)
                .then(function (result: any) {
                    if (result.features.length > 0) {
                        resolve(result);
                    } else {
                        console.log(`No data found`);
                        reject();
                    }
                })
                .catch(function (error: any) {
                    console.error(`Query failed: `, error);
                    reject();
                });
        });
        return promise;
    };

    const debounce = (func: any, delay: any) => {
        let timeoutId: any;

        return function (...args: any) {
            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    const calculateTracks = (features: any) => {
        const locData: any = {};
        for (const i in features) {
            console.log(features[i]);
            const date = features[i].attributes.travel_date;
            locData[date] = {
                attributes: features[i].attributes,
                geometry: features[i].geometry,
            };
        }
        setLocationsData(locData);

        const seq = Object.keys(locData);
        seq.sort((a: any, b: any) => a - b);
        for (let i = 0; i < seq.length - 1; i++) {
            const index = seq[i];
            const indexNext = seq[i + 1];

            // Check if this route already exists:
            checkTracks(index, indexNext, mapView).then(() => {
                // Setup the route parameters
                const routeParams = new RouteParameters({
                    // An authorization string used to access the routing service
                    apiKey: 'AAPKea1d57ae3f404aa8a07e1291bd504a2baAvU1yHyJKtH9HXhcBYZiJ02PN-Bn2lBQpZL7YcXwwvXNDOpfLd2MT5M6JmRH05k',
                    stops: new FeatureSet({
                        features: [
                            new Graphic({
                                geometry: locData[index].geometry,
                            }),
                            new Graphic({
                                geometry: locData[indexNext].geometry,
                            }),
                        ],
                    }),
                });

                if (
                    locData[indexNext].attributes.transport == 'car' ||
                    locData[indexNext].attributes.transport == 'car' ||
                    locData[indexNext].attributes.transport == 'bus' ||
                    locData[indexNext].attributes.transport == 'rentalCar'
                ) {
                    route.solve(routeUrl, routeParams).then((data) => {
                        const routeResult: any = data.routeResults[0].route;

                        addTrack(
                            locData[index],
                            locData[indexNext],
                            routeResult.geometry
                        ).then(() => {
                            console.log('Track added!');
                        });
                    });
                } else {
                    const directTrack = new Polyline({
                        paths: [
                            [
                                locData[index].geometry.longitude,
                                locData[index].geometry.latitude,
                            ],
                            [
                                locData[indexNext].geometry.longitude,
                                locData[indexNext].geometry.latitude,
                            ],
                        ],
                    });
                    addTrack(
                        locData[index],
                        locData[indexNext],
                        directTrack
                    ).then(() => {
                        console.log('Track added!');
                    });
                }
            });
        }
    };

    useEffect(() => {
        if (calculateTracksActive) {
            queryLocations(mapView);
        }
    }, [calculateTracksActive]);

    useEffect(() => {
        // For some reason it always excecuted this twice, so that's a hacky solution to fix this
        if (!isInitalizing) {
            initMapView();
            isInitalizing = true;
        }
    }, []);

    useEffect(() => {
        if (mapView != null && locations != null && tracks != null) {
            if (hoverFeatures == null) {
                locations.featureEffect = null;
                tracks.featureEffect = null;
                sleeps.featureEffect = null;
            } else {
                const filter = new FeatureFilter({});
                if (mapView.timeExtent != null) {
                    filter.timeExtent = mapView.timeExtent;
                    if (hoverFeatures != null) {
                        filter.where = attribute + " = '" + hoverFeatures + "'";
                    }

                    if (attribute == 'transport') {
                        tracks.featureEffect = new FeatureEffect({
                            filter: filter,
                            excludedEffect: 'grayscale(100%) opacity(70%)',
                            includedEffect:
                                'saturate(150%) drop-shadow(0, 0px, 12px)',
                        });
                    } else if (attribute == 'sleepCategory') {
                        locations.featureEffect = new FeatureEffect({
                            filter: filter,
                            excludedEffect: 'grayscale(100%) opacity(70%)',
                            includedEffect:
                                'saturate(150%) drop-shadow(0, 0px, 12px)',
                        });

                        sleeps.featureEffect = new FeatureEffect({
                            filter: filter,
                            excludedEffect: 'grayscale(100%) opacity(70%)',
                            includedEffect:
                                'saturate(150%) drop-shadow(0, 0px, 12px)',
                        });
                    }
                }
            }
        }
    }, [hoverFeatures]);

    return (
        <>
            <div
                id="mapContainer"
                style={{
                    width: '50%',
                    height: '100%',
                    backgroundColor: 'grey',
                }}
                ref={mapDivRef}
            ></div>
            <div
                id="tooltip"
                className="absolute cursor-default bg-black bg-opacity-40 rounded-lg p-[5px] text-white text-sm"
            ></div>
            {mapView
                ? React.Children.map(children, (child) => {
                      return React.cloneElement(
                          child as React.ReactElement<any>,
                          {
                              mapView,
                          }
                      );
                  })
                : null}
        </>
    );
};

export default ArcGISMapView;
