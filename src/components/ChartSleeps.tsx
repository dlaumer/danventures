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
    PieChart,
    Pie,
    Cell,
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
    const [translations, setTranslations] = useState<any>(null);

    useEffect(() => {
        parseData(features);
    }, [features]);

    const colors: any = {
        camping: '#1E3A8A',        // Deep Navy Blue
        house: '#3B82F6',          // Vibrant Blue
        boat: '#2563EB',           // Strong Royal Blue
        couchsurfing: '#1D4ED8',   // Bold Cobalt Blue
        volunteering: '#0C4A6E',   // Dark Ocean Blue
        hostel: '#60A5FA',         // Soft Light Blue
        airbnb: '#1E40AF',         // Classic Indigo Blue
        free: '#046c00',
        paid: '#b50000',
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ backgroundColor: "#fff", borderRadius: "10px", border: '1px solid #ccc', padding: '10px' }}>
                    <p>{`${payload[0].name}: ${payload[0].value} ${getTranslationStatic("days")}`}</p>
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
                translationsTemp[
                    getTranslationStatic(features[i].attributes[categories])
                ] = features[i].attributes[categories];
                dataTemp[features[i].attributes[categories]] = features[i].attributes[attribute]


                if (
                    features[i].attributes[categories] == 'camping' ||
                    features[i].attributes[categories] == 'boat' ||
                    features[i].attributes[categories] == 'house' ||
                    features[i].attributes[categories] == 'couchsurfing' ||
                    features[i].attributes[categories] == 'volunteering'

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



        const predefinedOrder = ["camping",
            "house",
            "boat",
            "couchsurfing",
            "volunteering",
            "hostel",
            "airbnb"]

        let data: any = []
        // Reorder the data based on predefinedOrder
        for (let i in predefinedOrder) {
            data.push({ name: getTranslationStatic(predefinedOrder[i]), days: dataTemp[predefinedOrder[i]] })
        }
        setData(data);
        setTranslations(translationsTemp);

        setDataFinancial([{ name: getTranslationStatic("free"), km: free }, { name: getTranslationStatic("paid"), km: paid }]);
    };

    return (
        <div className="w-full h-full chartsContainer2">
            <div className="h-[10%] w-full text-base font-bold flex items-center">
                {getTranslation('accomodation')}
            </div>
            <div id="chart3" className="h-[90%] w-full p-[5px]">
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
                            <Pie data={data} dataKey="days" nameKey="name" cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" label={({ name, days }) => name + ", " + days + " nights"} // Custom label function to show "name"
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
                            > {data?.map((entry: any, index: any) => (
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
export default ChartSleeps;
