import React, { useState } from 'react';
import {
    Button,
    FormWithRedirect,
    ReferenceInput,
    required,
    SaveButton,
    SelectInput,
    TextInput,
    useCreate,
    useNotify,
} from 'react-admin';
import TransferIcon from '@material-ui/icons/SwapHoriz';
import IconCancel from '@material-ui/icons/Cancel';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import MoneyFormat from '../util/MoneyFormat';

const categories = [
    { id: 0,  name:'Housing' },
    { id: 1,  name: 'Transportation' },
    { id: 2,  name: 'Food' },
    { id: 3,  name: 'Utilities' },
    { id: 4,  name: 'Clothing' },
    { id: 5,  name: 'Medical/Healthcare' },
    { id: 6,  name: 'Insurance' },
    { id: 7,  name: 'Household Items/Supplies' },
    { id: 8,  name: 'Personal' },
    { id: 9,  name: 'Debt' },
    { id: 10, name: 'Retirement' },
    { id: 11, name: 'Education' },
    { id: 12, name: 'Savings' },
    { id: 13, name: 'Gifts/Donations' },
    { id: 14, name: 'Entertainment' },
    { id: 15, name: 'Income' }
];

const validateTransfer = (values) => {
    const errors = {};
    if (values.from_account_id === values.to_account_id) {
        errors.from_account_id = 'The accounts cannot be the same';
        errors.to_account_id = 'The accounts cannot be the same';
    }
    if (values.amount <= 0) {
        errors.amount = 'Amount must be grater than zero';
    }
    return errors;
}

const TransferQuickCreateButton = ({ onChange, ...props}) => {
    const [showDialog, setShowDialog] = useState(false);
    const [create, { loading }] = useCreate('account/transfer');
    const notify = useNotify();

    const handleClick = () => {
        setShowDialog(true);
    };

    const handleCloseClick = () => {
        setShowDialog(false);
    };

    const handleSubmit = async values => {
        create(
            { payload: { data: values } },
            {
                onSuccess: ({ data }) => {
                    setShowDialog(false);
                    onChange();
                },
                onFailure: ({ error }) => {
                    notify(error.message, 'error');
                }
            }
        );
    };

    return (
        <>
            <Button onClick={handleClick} label="ra.action.create"
                disabled={props.disabled}>
                <TransferIcon />
            </Button>
            <Dialog
                fullWidth
                open={showDialog}
                onClose={handleCloseClick}
                aria-label="Transfer"
            >
                <DialogTitle>Create address</DialogTitle>
                <FormWithRedirect
                    save={handleSubmit}
                    validate={validateTransfer}
                    render={({
                            handleSubmitWithRedirect,
                            pristine,
                            saving
                    }) => (
                        <>
                            <DialogContent>
                                <ReferenceInput
                                    source="from_account_id"
                                    reference="account"
                                >
                                    <SelectInput
                                        validate={required()}
                                        optionText={
                choice => `${choice.name} (${MoneyFormat(2)(choice.balance)})`
                                        }
                                    />
                                </ReferenceInput>
                                <ReferenceInput
                                    source="to_account_id"
                                    reference="account"
                                >
                                    <SelectInput
                                        validate={required()}
                                        optionText={
                choice => `${choice.name} (${MoneyFormat(2)(choice.balance)})`
                                        }
                                    />
                                </ReferenceInput>
                                <TextInput
                                    source="amount"
                                    validate={required()}
                                    fullWidth
                                />
                                <SelectInput
                                    source="category"
                                    choices={categories}
                                    optionValue="name"
                                    fullWidth
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    label="ra.action.cancel"
                                    onClick={handleCloseClick}
                                    disabled={loading}
                                >
                                    <IconCancel />
                                </Button>
                                <SaveButton
                                    handleSubmitWithRedirect={
                                        handleSubmitWithRedirect
                                    }
                                    pristine={pristine}
                                    saving={saving}
                                    disabled={loading}
                                />
                            </DialogActions>
                        </>
                    )}
                />
            </Dialog>
        </>
    );
}

export default TransferQuickCreateButton;
