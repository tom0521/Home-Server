import React, { useContext } from "react";
import { useQueryWithStore, Loading, Error } from 'react-admin';
import {
    Grid,
    Typography,
} from '@material-ui/core';
import { Decimal } from 'decimal.js';
import Title from './Title';
import DateContext from '../util/DateContext';
import MoneyFormat from '../util/MoneyFormat';

const OverallStats = props => { 
    const today = useContext(DateContext);
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

    let income = new Decimal(0);
    let expenses = new Decimal(0);
    let net_income = new Decimal(0);
    data.forEach((elem) => {
        if (elem.category && elem.category === 'Income') {
            income = income.plus(elem.amount);
        } else {
            expenses = expenses.minus(elem.amount);
        }
        net_income = net_income.plus(elem.amount);
    });

    return (
        <React.Fragment>
            <Grid container spacing={1}>
                <Grid item xs={12} md={4} lg={4}>
                    <Title>Income</Title>
                    <Typography component="p" variant="h4">
                        { MoneyFormat(2)(income) }
                    </Typography>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <Title>Expenses</Title>
                    <Typography component="p" variant="h4">
                        { MoneyFormat(2)(expenses) }
                    </Typography>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <Title>Net Income</Title>
                    <Typography component="p" variant="h4">
                        { MoneyFormat(2)(net_income) }
                    </Typography>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default OverallStats;
