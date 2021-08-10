import * as React from "react";
import { useRecordContext } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import ReceiptIcon from '@material-ui/icons/Receipt';

const useStyles = makeStyles({
    link: {
        textDecoration: 'none',
    },
});

const ReceiptField = ({ source }) => {
    const record = useRecordContext();
    const classes = useStyles();
    return (record && record[source]) ? (
        <a href={record[source]} className={classes.link}>
            <ReceiptIcon />
        </a>
    ) : null;
}
export default ReceiptField;
