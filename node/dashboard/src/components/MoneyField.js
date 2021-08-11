import * as React from "react";
import { NumberField } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles({
    asset: { color: 'green' },
    debt:  { color: 'red' },
});

const MoneyField = props => {
    const classes = useStyles();
    return (
        <NumberField
            options={{ style: 'currency', currency: 'USD', signDisplay: 'exceptZero', }}
            className={classnames({
                [classes.asset]: props.record[props.source] > 0,
                [classes.debt]: props.record[props.source] < 0,
            })}
            {...props} />
    );
};
export default MoneyField;
