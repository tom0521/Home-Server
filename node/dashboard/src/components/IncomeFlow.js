import * as React from "react";
import { useQueryWithStore, Loading, Error } from 'react-admin';
import { Card, CardContent } from '@material-ui/core';
import { Bar } from 'react-chartjs-2';

const graphData = {
    labels: [],
    datasets:[
        {
            type: 'line',
            label: 'Net Income',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 2,
            fill: false,
            data: []
        },
        {
            type: 'bar',
            label: 'Income',
            backgroundColor: 'rgb(75, 192, 192)',
            data: []
        },
        {
            type: 'bar',
            label: 'Expenses',
            backgroundColor: 'rgb(255, 99, 132)',
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
    
    data.forEach((elem) => {
        let timestamp = new Date(elem.timestamp);
        // This transaction is the first or the start of a new month
        if (graphData.labels.length === 0 ||
            timestamp.getMonth()+1 !== graphData.labels[graphData.labels.length-1]) {
            // Append a new label, expense, income, and net income
            // TODO: use the long month name
            graphData.labels.push(timestamp.getMonth()+1);
            graphData.datasets[0].data.push(
                (graphData.datasets[0].data.length === 0) ? 0 :
                graphData.datasets[0].data[graphData.datasets[0].length-1]
            );
            graphData.datasets[1].data.push(0);
            graphData.datasets[2].data.push(0);
        }
        if (elem.category && elem.category === 'Income') {
            graphData.datasets[1].data[graphData.datasets[1].data.length-1] += elem.amount;
        } else {
            graphData.datasets[2].data[graphData.datasets[2].data.length-1] -= elem.amount;
        }
        graphData.datasets[0].data[graphData.datasets[0].data.length-1] += elem.amount;
    });

    return (
        <Card>
            <CardContent>
                <Bar data={graphData} />
            </CardContent>
        </Card>
    );
};

export default IncomeFlow;
