import { getTranslation, getTranslationStatic } from '@services/languageHelper';
import { setAttribute, setHoverFeatures } from '@store/reducer';
import { selectAttribute, selectFeatures } from '@store/selectors';
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
    Cell,
} from 'recharts';

type ChartProps = {
    title?: string;
};
const ChartDistance: FC<ChartProps & React.ComponentProps<'button'>> = ({
    title = 'Default',
    ...props
}) => {
    const dispatch = useDispatch();
    const features = useSelector(selectFeatures);
    const attribute: string = 'sumLength';
    const categories: string = 'transport';
    const [data, setData] = useState<any>(null);
    const [dataFinancial, setDataFinancial] = useState<any>(null);
    const [translations, setTranslations] = useState<any>(null);

    useEffect(() => {
        parseData(features);
    }, [features]);

    const colors: any = {
        car: '#73B2FF',
        truck: '#73DFFF',
        boat: '#FF7F7F',
        bus: '#A7C636',
        ferry: '#FFAA00',
        foot: '#C500FF',
        rentalCar: '#FFFF00',
        plane: '#000000',
    };

    const tickFormatter = (value: string, index: number) => {
        const limit = 10; // put your maximum character
        if (value.length < limit) return value;
        return `${value.substring(0, limit)}...`;
    };

    const parseData = (features: any) => {
        const dataTemp = [];
        const translationsTemp: any = {};

        translationsTemp[getTranslationStatic('paid')] = 'paid';
        translationsTemp[getTranslationStatic('free')] = 'free';

        let paid = 0;
        let free = 0;
        for (const i in features) {
            if (
                features[i].attributes[categories] != null &&
                features[i].attributes[categories] != ''
            ) {
                const km = Math.round(
                    (features[i].attributes[attribute] * 0.9144) / 1000
                );
                translationsTemp[
                    getTranslationStatic(features[i].attributes[categories])
                ] = features[i].attributes[categories];
                dataTemp.push({
                    name: getTranslationStatic(
                        features[i].attributes[categories]
                    ),
                    km: km,
                });
                if (
                    features[i].attributes[categories] == 'car' ||
                    features[i].attributes[categories] == 'truck' ||
                    features[i].attributes[categories] == 'boat' ||
                    features[i].attributes[categories] == 'foot'
                ) {
                    free += km;
                } else if (
                    features[i].attributes[categories] == 'bus' ||
                    features[i].attributes[categories] == 'ferry' ||
                    features[i].attributes[categories] == 'rentalCar' ||
                    features[i].attributes[categories] == 'plane'
                ) {
                    paid += km;
                }
            }
        }
        setData(dataTemp);
        setTranslations(translationsTemp);

        setDataFinancial([{ paid: paid, free: free, km: free }]);
    };

    return (
        <div className="w-full h-full chartsContainer2">
            <div className="h-[10%] w-full text-base font-bold flex items-center">
                {getTranslation('transportation')}
            </div>
            <div id="chart1" className="h-[45%] w-full p-[5px]">
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
                            <XAxis
                                dataKey="name"
                                tickFormatter={tickFormatter}
                            />
                            <Tooltip />
                            <Bar
                                dataKey="km"
                                fill="#000000"
                                onMouseOver={(event) => {
                                    dispatch(setAttribute(categories));
                                    dispatch(
                                        setHoverFeatures(
                                            translations[event.name]
                                        )
                                    );
                                }}
                                onMouseOut={(event) => {
                                    dispatch(setHoverFeatures(null));
                                }}
                            >
                                {data?.map((entry: any, index: any) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={colors[translations[entry.name]]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div id="chart2" className="h-[45%] w-full p-[5px]">
                <div className="w-full h-full bg-lighergray rounded-xl p-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={dataFinancial}
                            layout="vertical"
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <XAxis type="number" />
                            <Tooltip />
                            <Bar
                                dataKey="free"
                                fill="#FFD37F"
                                onMouseOver={(event) => {
                                    dispatch(setAttribute(categories));
                                    dispatch(
                                        setHoverFeatures(
                                            translations[event.name]
                                        )
                                    );
                                }}
                                onMouseOut={(event) => {
                                    dispatch(setHoverFeatures(null));
                                }}
                                activeBar={<Rectangle fill="#febc42" />}
                            />
                            <Bar
                                dataKey="paid"
                                fill="#FFD37F"
                                onMouseOver={(event) => {
                                    dispatch(setAttribute(categories));
                                    dispatch(
                                        setHoverFeatures(
                                            translations[event.name]
                                        )
                                    );
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
export default ChartDistance;
