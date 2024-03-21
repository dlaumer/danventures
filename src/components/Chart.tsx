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

const exampleData = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

type ChartProps = {
    title?: string;
};
const Chart: FC<ChartProps & React.ComponentProps<'button'>> = ({
    title = 'Default',
    ...props
}) => {
    const dispatch = useDispatch();
    const features = useSelector(selectFeatures);
    const attribute = useSelector(selectAttribute);

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
                features[i].attributes[attribute] != null &&
                features[i].attributes[attribute] != ''
            ) {
                dataTemp.push({
                    name: getTranslationStatic(
                        features[i].attributes[attribute]
                    ),
                    value:
                        Math.round(
                            features[i].attributes.count_Attribute * 100
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
                    fill="#A2C367"
                    onMouseOver={(event) => {
                        dispatch(setHoverFeatures(event.name));
                    }}
                    onMouseOut={(event) => {
                        dispatch(setHoverFeatures(null));
                    }}
                    activeBar={<Rectangle fill="#79924e" />}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};
export default Chart;
