import { getTranslation, getTranslationStatic } from '@services/languageHelper';
import { setHoverFeatures } from '@store/reducer';
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
        for (const i in features) {
            if (
                features[i].attributes[categories] != null &&
                features[i].attributes[categories] != ''
            ) {
                dataTemp.push({
                    name: getTranslationStatic(
                        features[i].attributes[categories]
                    ),
                    value:
                        Math.round(
                            ((features[i].attributes[attribute] * 0.9144) /
                                1000) *
                                100
                        ) / 100,
                });
            }
        }
        setData(dataTemp);
    };

    return (
        <ResponsiveContainer width="100%" height="85%">
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
                <XAxis dataKey="name" tickFormatter={tickFormatter} />
                <YAxis />
                <Tooltip />
                <Bar
                    dataKey="value"
                    fill="#FFD37F"
                    onMouseOver={(event) => {
                        dispatch(setHoverFeatures(event.name));
                    }}
                    onMouseOut={(event) => {
                        dispatch(setHoverFeatures(null));
                    }}
                    activeBar={<Rectangle fill="#febc42" />}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};
export default ChartDistance;
