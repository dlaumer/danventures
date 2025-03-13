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
    PieChart,
    Pie,
    Rectangle,
    Cell,
    LabelList,
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
        foot: '#C500FF',
        plane: '#000000',
        bus: '#A7C636',
        train: '#38a800',
        taxi: '#00e6a9',
        ferry: '#FFAA00',
        rentalCar: '#FFFF00',
        free: '#046c00',
        paid: '#b50000',
    };

    const tickFormatter = (value: string, index: number) => {
        const limit = 10; // put your maximum character
        if (value.length < limit) return value;
        return `${value.substring(0, limit)}...`;
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ backgroundColor: "#fff", borderRadius: "10px", border: '1px solid #ccc', padding: '10px' }}>
                    <p>{`${payload[0].name}: ${payload[0].value} km`}</p>
                </div>
            );
        }
        return null;
    };

    const parseData = (features: any) => {
        let dataTemp: any = {};
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
                const km = Math.round(features[i].attributes[attribute] / 1000);
                translationsTemp[
                    getTranslationStatic(features[i].attributes[categories])
                ] = features[i].attributes[categories];
                dataTemp[features[i].attributes[categories]] = km

                if (
                    features[i].attributes[categories] == 'car' ||
                    features[i].attributes[categories] == 'truck' ||
                    features[i].attributes[categories] == 'boat' ||
                    features[i].attributes[categories] == 'foot'
                ) {
                    free += km;
                } else if (
                    features[i].attributes[categories] == 'train' ||
                    features[i].attributes[categories] == 'taxi' ||
                    features[i].attributes[categories] == 'bus' ||
                    features[i].attributes[categories] == 'ferry' ||
                    features[i].attributes[categories] == 'rentalCar' ||
                    features[i].attributes[categories] == 'plane'
                ) {
                    paid += km;
                }
            }
        }


        const predefinedOrder = ["car",
            "truck",
            "boat",
            "foot",
            "plane",
            "bus",
            "train",
            "taxi",
            "ferry",
            "rentalCar"]

        let data: any = []
        // Reorder the data based on predefinedOrder
        for (let i in predefinedOrder) {
            data.push({ name: getTranslationStatic(predefinedOrder[i]), km: dataTemp[predefinedOrder[i]] })
        }

        setData(data);
        setTranslations(translationsTemp);

        setDataFinancial([{ name: getTranslationStatic("free"), km: free }, { name: getTranslationStatic("paid"), km: paid }]);
    };


    return (
        <div className="w-full h-full chartsContainer2">
            <div className="h-[10%] w-full text-base font-bold flex items-center">
                {getTranslation('transportation')}
            </div>
            <div id="chart1" className="h-[80%] w-full p-[5px]">
                <div className="w-full h-full bg-lighergray rounded-xl p-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart
                            margin={{
                                top: 25,
                                right: 0,
                                left: 0,
                                bottom: 25,
                            }} >
                            <Tooltip content={<CustomTooltip />} />
                            <Pie data={dataFinancial} dataKey="km" nameKey="name" cx="50%" cy="50%" outerRadius="50%" fill="#8884d8"
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
                                }}>

                                {dataFinancial?.map((entry: any, index: any) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={colors[translations[entry.name]]}
                                    />
                                ))}
                            </Pie>
                            <Pie data={data} dataKey="km" nameKey="name" cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" fill="#82ca9d" label={({ name, km }) => name + ", " + km + "km"} // Custom label function to show "name"
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
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
export default ChartDistance;
