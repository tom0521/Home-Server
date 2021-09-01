import * as React from "react";
import { ChipField } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles({
    housing: { 'backgroundColor': '#2f4f4f' },
    transportation: { 'backgroundColor': '#a52a2a' },
    education: { 'backgroundColor': '#006400' },
    utilities: { 'backgroundColor': '#bdb76b' },
    clothing: { 'backgroundColor': '#ffb6c1' },
    medical: { 'backgroundColor': '#ff1493' },
    insurance: { 'backgroundColor': '#87ceeb' },
    household: { 'backgroundColor': '#1e90ff' },
    personal: { 'backgroundColor': '#ff00ff' },
    savings: { 'backgroundColor': '#0000ff' },
    food: { 'backgroundColor': '#00fa9a' },
    gifts: { 'backgroundColor': '#ffff00' },
    entertainment: { 'backgroundColor': '#ffa500' },
    retirement: { 'backgroundColor': '#00008b' },
    debt: { 'backgroundColor': '#ff0000' },
    income: { 'backgroundColor': '#00ff00' },
});

const CategoryField = props => {
    const classes = useStyles();
    return props.record && props.record[props.source] ? (
        <ChipField
            className={classnames({
                [classes.housing]: props.record[props.source] === 'Housing',
                [classes.transportation]: props.record[props.source] === 'Transportation',
                [classes.food]: props.record[props.source] === 'Food',
                [classes.utilities]: props.record[props.source] === 'Utilities',
                [classes.clothing]: props.record[props.source] === 'Clothing',
                [classes.medical]: props.record[props.source] === 'Healthcare',
                [classes.insurance]: props.record[props.source] === 'Insurance',
                [classes.household]: props.record[props.source] === 'Household Items',
                [classes.personal]: props.record[props.source] === 'Personal',
                [classes.savings]: props.record[props.source] === 'Savings',
                [classes.entertainment]: props.record[props.source] === 'Entertainment',
                [classes.gifts]: props.record[props.source] === 'Gifts/Donations',
                [classes.education]: props.record[props.source] === 'Education',
                [classes.retirement]: props.record[props.source] === 'Retirement',
                [classes.debt]: props.record[props.source] === 'Debt',
                [classes.income]: props.record[props.source] === 'Income',
            })}
            {...props} />
    ) : null;
};
export default CategoryField;
