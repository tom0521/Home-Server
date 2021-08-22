import * as React from "react";
import { useQueryWithStore, Loading, Error } from 'react-admin';
import { Card, CardContent } from '@material-ui/core';
import { Doughnut } from 'react-chartjs-2';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';
import orange from '@material-ui/core/colors/orange';
import purple from '@material-ui/core/colors/purple';
import indigo from '@material-ui/core/colors/indigo';
import teal from '@material-ui/core/colors/teal';

const graphOptions = {
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: true,
            text: 'Expenses',
        },
    },
}

const graphData = {
    labels: [],
    datasets:[
        {
            label: 'Expenses',
            data: [],
            backgroundColor: [
                red[500],
                blue[500],
                green[500],
                yellow[500],
                orange[500],
                purple[500],
                indigo[500],
                teal[500],
            ],
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

    const categories = {};
    let total = 0;
    data.forEach((elem) => {
        if (elem.category && elem.category !== 'Income' &&
            elem.category !== 'Debt') {
            categories[elem.category] = (categories[elem.category] || 0) - elem.amount;
            total -= elem.amount;
        }
    });
    graphOptions.centertext = Intl.NumberFormat('en-US', {
                                        style: 'currency', currency: 'USD'
                                    }).format(total);
    graphData.labels = Object.keys(categories);
    graphData.datasets[0].data = Object.values(categories);

    return (
        <Card>
            <CardContent>
                <Doughnut
                    data={graphData}
                    options={graphOptions}
                    plugins={
                        [{
                            beforeDraw: (chart, args, options) => {
                                if (chart.options.centertext) {
                                    var width = chart.width,
                                        height = chart.height,
                                        ctx = chart.ctx;

                                    ctx.restore();
                                    var fontSize = (height / 160).toFixed(2);
                                    ctx.font = fontSize + "em sans-serif";
                                    ctx.textBaseline = "middle";

                                    var text = chart.options.centertext,
                                        textX = Math.round((width - ctx.measureText(text).width) / 2),
                                        textY = height / 2 - (chart.titleBlock.height - 15);

                                    ctx.fillText(text, textX, textY);
                                    ctx.save();
                                }
                            }
                        }]
                    }
                />
            </CardContent>
        </Card>
    );
};

export default IncomeFlow;
