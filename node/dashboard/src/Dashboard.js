import * as React from "react";
import {
    Container,
    Grid,
    Paper
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpensePie from './components/ExpensePie';
import IncomeFlow from './components/IncomeFlow';

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
        height: 240,
    },
}));

const Dashboard = props => {
    const classes = useStyles();
    return (
        <Container maxWidth='lg'>
            <Grid container spacing={3} className={classes.container}>
                <Grid item xs={12} md={4} lg={3}>
                    <Paper className={classes.paper}>
                        <ExpensePie />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={8} lg={9}>
                    <Paper className={classes.paper}>
                        <IncomeFlow />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
