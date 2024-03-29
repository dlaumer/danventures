import { getTranslation, getTranslationStatic } from '@services/languageHelper';
import { setAttribute, setHoverFeatures } from '@store/reducer';
import {
    selectAttribute,
    selectFeatures,
    selectSleepCategories,
} from '@store/selectors';
import React, { FC, PureComponent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    Rectangle,
} from 'recharts';

type ChartProps = {
    title?: string;
};
const ChartSleeps: FC<ChartProps & React.ComponentProps<'button'>> = ({
    title = 'Default',
    ...props
}) => {
    const dispatch = useDispatch();
    const features = useSelector(selectSleepCategories);
    const attribute: string = 'countSleeps';
    const categories: string = 'sleepCategory';
    const [data, setData] = useState<any>(null);
    const [dataFinancial, setDataFinancial] = useState<any>(null);

    useEffect(() => {
        parseData(features);
    }, [features]);

    const tickFormatter = (value: string, index: number) => {
        const limit = 10; // put your maximum character
        if (value.length < limit) return value;
        return `${value.substring(0, limit)}...`;
    };

    const parseData = (features: any) => {
        const dataTemp = [];
        let paid = 0;
        let free = 0;
        for (const i in features) {
            if (
                features[i].attributes[categories] != null &&
                features[i].attributes[categories] != ''
            ) {
                dataTemp.push({
                    name: getTranslationStatic(
                        features[i].attributes[categories]
                    ),
                    value: features[i].attributes[attribute],
                });
                if (
                    features[i].attributes[categories] == 'camping' ||
                    features[i].attributes[categories] == 'boat' ||
                    features[i].attributes[categories] == 'house' ||
                    features[i].attributes[categories] == 'couchsurfing'
                ) {
                    free += features[i].attributes[attribute];
                } else if (
                    features[i].attributes[categories] == 'airbnb' ||
                    features[i].attributes[categories] == 'hostel'
                ) {
                    paid += features[i].attributes[attribute];
                }
            }
        }
        setData(dataTemp);
        setDataFinancial([
            { name: 'free', value: free },
            { name: 'paid', value: paid },
        ]);
    };

    return (
        <div className="w-1/2 h-full chartsContainer2">
            <div className="h-[10%] w-full text-base font-bold flex items-center">
                {getTranslation('accomodation')}
            </div>
            <div id="chart3" className="h-[45%] w-full p-[5px]">
                <div className="w-full h-full bg-lighergray rounded-xl p-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                tickFormatter={tickFormatter}
                            />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey="value"
                                fill="#FFD37F"
                                onMouseOver={(event) => {
                                    dispatch(setAttribute(categories));
                                    dispatch(setHoverFeatures(event.name));
                                }}
                                onMouseOut={(event) => {
                                    dispatch(setHoverFeatures(null));
                                }}
                                activeBar={<Rectangle fill="#febc42" />}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div id="chart4" className="h-[45%] w-full p-[10px]">
                <div className="w-full h-full bg-lighergray rounded-xl p-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={dataFinancial}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                tickFormatter={tickFormatter}
                            />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey="value"
                                fill="#FFD37F"
                                onMouseOver={(event) => {
                                    dispatch(setAttribute(categories));
                                    dispatch(setHoverFeatures(event.name));
                                }}
                                onMouseOut={(event) => {
                                    dispatch(setHoverFeatures(null));
                                }}
                                activeBar={<Rectangle fill="#febc42" />}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
export default ChartSleeps;
