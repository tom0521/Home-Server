import * as React from "react";
import { useQueryWithStore, Loading, Error } from 'react-admin';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
} from 'recharts';
import { Decimal } from 'decimal.js';
import blue from '@material-ui/core/colors/blue';
import Title from './Title';

const IncomeFlow = props => { 
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
    let total = new Decimal(0);
    data.forEach((elem) => {
        if (elem.category && elem.category !== 'Income' &&
            elem.category !== 'Debt') {
            categories[elem.category] = (categories[elem.category] || new Decimal(0)).minus(elem.amount);
            total = total.minus(elem.amount);
        }
    });
    let centertext = Intl.NumberFormat('en-US', {
                                        style: 'currency', currency: 'USD'
                                    }).format(total);
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
                        data={graphData}
                        dataKey="amount"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill={blue[500]}
                        label
                    />
                </PieChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
};

export default IncomeFlow;
