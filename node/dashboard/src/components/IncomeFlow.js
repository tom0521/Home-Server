import * as React from "react";
import { useQueryWithStore, Loading, Error } from 'react-admin';
import { Card, CardContent } from '@material-ui/core';
import { Bar } from 'react-chartjs-2';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';

const graphOptions = {
    plugins: {
        title: {
            display: true,
            text: 'Income Flow',
        },
        legend: {
            display: false,
        },
    },
    scales: {
        y: {
            ticks: {
                callback: function(value, index, values) {
                    return new Intl.NumberFormat('en-US', { 
                            style: 'currency', currency: 'USD' 
                        }).format(value);
                },
            },
        },
    },
};

const graphData = {
    labels: [],
    datasets:[
        {
            type: 'line',
            label: 'Net Income',
            borderColor: blue[500],
            borderWidth: 2,
            fill: false,
            data: []
        },
        {
            type: 'bar',
            label: 'Income',
            backgroundColor: green[500],
            data: []
        },
        {
            type: 'bar',
            label: 'Expenses',
            backgroundColor: red[500],
            borderWidth: 2,
            borderColor: 'white',
            data: []
        },
    ],
};

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

    const labels = [];
    const income_flow = [];
    const income = [];
    const expenses = [];
    
    data.forEach((elem) => {
        let timestamp = new Date(elem.timestamp);
        // This transaction is the first or the start of a new month
        if (labels.length === 0 ||
            timestamp.getMonth() !== labels[labels.length-1].getMonth()) {
            // Append a new label, expense, income, and net income
            labels.push(timestamp);
            income_flow.push(
                (income_flow.length === 0) ? 0 :
                income_flow[income_flow.length-1]
            );
            income.push(0);
            expenses.push(0);
        }
        if (elem.category && elem.category === 'Income') {
            income[income.length-1] += elem.amount;
        } else {
            expenses[expenses.length-1] -= elem.amount;
        }
        income_flow[income_flow.length-1] += elem.amount;
    });
    labels.forEach((elem, idx) => {
        labels[idx] = Intl.DateTimeFormat('en-US',
                { month: 'long' }
            ).format(elem);
    });
    graphData.labels = labels;
    graphData.datasets[0].data = income_flow;
    graphData.datasets[1].data = income;
    graphData.datasets[2].data = expenses;

    return (
        <Card>
            <CardContent>
                <Bar data={graphData} options={graphOptions} />
            </CardContent>
        </Card>
    );
};

export default IncomeFlow;
