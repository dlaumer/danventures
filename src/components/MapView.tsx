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
    setIsLoggedIn,
    setLogInAttempt,
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

    const [locations, setLocations] = useState<FeatureLayer>(null);
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
            title: '{indexFrom} - {indexTo}',
            content: setContentInfoTracks,
        });
        // The view instance is the most important instance for ArcGIS, from here you can access almost all elements like layers, ui elements, widget, etc
        const view = new MapView({
            popupEnabled: true,
            container: mapDivRef.current,
            map: map,
            padding: {
                top: 70,
            },
            center: [-10, 30],
            zoom: 4,
        });

        const rendererLocations: any = {
            type: 'unique-value', // autocasts as new UniqueValueRenderer()
            field: 'category',
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
                        size: 10, // pixels
                        outline: {
                            // autocasts as new SimpleLineSymbol()
                            color: [153, 153, 153, 64],
                            width: 0.75, // points
                        },
                        color: [0, 197, 255, 255],
                    },
                },
                {
                    // All features with value of "East" will be green
                    value: 'sleep',
                    symbol: {
                        type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
                        style: 'circle',
                        size: 15, // pixels
                        outline: {
                            // autocasts as new SimpleLineSymbol()
                            color: [153, 153, 153, 64],
                            width: 0.75, // points
                        },
                        color: [85, 255, 0, 255],
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

        const tracksLayer = new FeatureLayer({
            portalItem: {
                id: tracksId,
            },
            renderer: rendererTracks,
            outFields: ['*'],
        });

        view.map.add(tracksLayer);

        const locationsLayer = new FeatureLayer({
            portalItem: {
                id: locationsId,
            },
            renderer: rendererLocations,
            outFields: ['*'],
        });

        view.map.add(locationsLayer);

        setLocations(locationsLayer);
        setTracks(tracksLayer);

        locationsLayer.popupTemplate = templateLocations;
        tracksLayer.popupTemplate = templateTracks;

        const slider = new TimeSlider({
            view: view,
            mode: 'time-window',
            fullTimeExtent: {
                start: new Date(2000, 1, 1),
                end: actualDate,
            },
            timeExtent: {
                start: new Date(2000, 1, 1),
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
            //view.goTo(locationsLayer.fullExtent);
        });

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

    const queryTracks = (from: string, to: string, view: MapView) => {
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

            // Perform the query on the feature layer
            locations
                .queryFeatures(query)
                .then(function (result: any) {
                    if (result.features.length > 0) {
                        calculateTracks(result.features);
                        dispatch(setCalculateTracksActive(false));
                    } else {
                        console.log(`No data found`);
                        dispatch(setCalculateTracksActive(false));
                    }
                })
                .catch(function (error: any) {
                    console.error(`Query failed: `, error);
                    dispatch(setCalculateTracksActive(false));
                });
        }
    };

    const addTrack = (from: string, to: string, track: any) => {
        const myPromise: Promise<string> = new Promise((resolve, reject) => {
            const attributes = {
                indexFrom: from,
                indexTo: to,
                transport: 'car',
            };

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

    const calculateTracks = (features: any) => {
        const locData: any = {};
        for (const i in features) {
            console.log(features[i]);
            const seq = features[i].attributes.sequence;
            locData[seq] = {
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
            queryTracks(index, indexNext, mapView).then(() => {
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

                route.solve(routeUrl, routeParams).then((data) => {
                    const routeResult: any = data.routeResults[0].route;

                    addTrack(index, indexNext, routeResult.geometry).then(
                        () => {
                            console.log('Track added!');
                        }
                    );
                });
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

    return (
        <>
            <div
                style={{
                    width: '100%',
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
