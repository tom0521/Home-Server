import * as React from "react";
import clsx from 'clsx';
import {
    Container,
    Grid,
    Paper
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpensePie from './components/ExpensePie';
import IncomeFlow from './components/IncomeFlow';
import OverallStats from './components/OverallStats';

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
}));

const Dashboard = props => {
    const classes = useStyles();
    const fixedPaper = clsx(classes.fixedHeight, classes.paper);
    return (
        <Container maxWidth='lg'>
            <Grid container spacing={3} className={classes.container}>
                <Grid item xs={12} md={12} lg={12}>
                    <Paper className={classes.paper}>
                        <OverallStats />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                    <Paper className={fixedPaper}>
                        <ExpensePie />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={8} lg={9}>
                    <Paper className={fixedPaper}>
                        <IncomeFlow />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
