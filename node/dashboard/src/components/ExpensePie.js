import React, { useState } from "react";
import { useQueryWithStore, Loading, Error } from 'react-admin';
import {
    Cell,
    ResponsiveContainer,
    PieChart,
    Pie,
    Sector,
} from 'recharts';
import { Decimal } from 'decimal.js';
import blue from '@material-ui/core/colors/blue';
import Title from './Title';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const renderActiveShape = props => {
    const {
        cx,
        cy,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        fill,
        payload,
        percent,
        value
    } = props;

    return (
        <g>
            <text x={cx} y={cy} dy={-18} textAnchor="middle" fill="#333">
                {payload.name}
            </text>
            <text x={cx} y={cy} textAnchor="middle" fill="#333">
                { Intl.NumberFormat('en-US', {
                    style: 'currency', currency: 'USD'
                    }).format(value)
                }
            </text>
            <text x={cx} y={cy} dy={18} textAnchor="middle" fill="#999">
                {`${(percent * 100).toFixed(2)}%`}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
        </g>
    );
};

const IncomeFlow = props => { 
    const [ activeIndex, setActiveIndex ] = useState(0);
    const { loaded, error, data } = useQueryWithStore({
        type: 'getList',
        resource: 'transaction',
        payload: {
            pagination: {
                page: 1,
                perPage: 1000,
            },
            sort: {
                field: 'timestamp',
                order: 'ASC',
            },
        }
    });
    if (!loaded) { return <Loading />; }
    if (error) { return <Error />; }

    const categories = {};
    data.forEach((elem) => {
        if (elem.category && elem.category !== 'Income' &&
            elem.category !== 'Debt') {
            categories[elem.category] = (categories[elem.category] || new Decimal(0)).minus(elem.amount);
        }
    });

    const graphData = [];
    for (const [key, val] of Object.entries(categories)) {
        graphData.push({
            name: key,
            amount: val.toNumber(),
        });
    }

    return (
        <React.Fragment>
            <Title>Expenses</Title>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={graphData}
                        dataKey="amount"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill={blue[500]}
                        onMouseEnter={(_,idx) => setActiveIndex(idx)}
                    >
                        { graphData.map((elem, idx) => (
                            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
};

export default IncomeFlow;
