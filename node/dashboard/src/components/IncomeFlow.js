import React, { useContext } from "react";
import { useQueryWithStore, Loading, Error } from 'react-admin';
import {
    CartesianGrid,
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Decimal } from 'decimal.js';
import { useTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import Title from './Title';
import DateContext from '../util/DateContext';

const IncomeFlow = props => { 
    const today = useContext(DateContext);
    const theme = useTheme();
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
            filter: {
                to_date: today,
            },
        }
    });
    if (!loaded) { return <Loading />; }
    if (error) { return <Error />; }

    const graphData = [];
    
    data.forEach((elem) => {
        let month = Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(elem.timestamp));
        // This transaction is the first or the start of a new month
        if (graphData.length === 0 || month !== graphData[graphData.length-1].label) {
            // Append a new label, expense, income, and net income
            graphData.push({
                label: month,
                income: new Decimal(0),
                expenses: new Decimal(0),
                net_income: (graphData.length === 0) ? new Decimal(0) :
                            graphData[graphData.length-1].net_income,
            });
        }
        if (elem.category && elem.category === 'Income') {
            graphData[graphData.length-1].income =
                graphData[graphData.length-1].income.plus(elem.amount);
        } else {
            graphData[graphData.length-1].expenses =
                graphData[graphData.length-1].expenses.minus(elem.amount);
        }
        graphData[graphData.length-1].net_income =
            graphData[graphData.length-1].net_income.plus(elem.amount);
    });

    graphData.forEach((val, idx) => {
        graphData[idx].income     = val.income.toNumber();
        graphData[idx].expenses   = val.expenses.toNumber();
        graphData[idx].net_income = val.net_income.toNumber();
    });

    return (
        <React.Fragment>
            <Title>Net Income</Title>
            <ResponsiveContainer>
                <ComposedChart
                    data={graphData}
                    margin={{
                        top: 16,
                        right: 16,
                        bottom: 0,
                        left: 24,
                    }}
                >
                    <CartesianGrid strokeDashArray="3" />
                    <XAxis dataKey="label" stroke={theme.palette.text.secondary} />
                    <YAxis stroke={theme.palette.text.secondary} />
                    <Tooltip />
                    <Bar dataKey="income" barSize={40} fill={green[500]} />
                    <Bar dataKey="expenses" barSize={40} fill={red[500]} />
                    <Line type="monotone" dataKey="net_income" stroke={blue[500]} dot />
                </ComposedChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
};

export default IncomeFlow;
