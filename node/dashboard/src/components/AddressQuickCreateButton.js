import React, { useState } from 'react';
import { useForm } from 'react-final-form';
import {
    Button,
    FormWithRedirect,
    required,
    SaveButton,
    TextInput,
    useCreate,
    useNotify,
} from 'react-admin';
import IconContentAdd from '@material-ui/icons/Add';
import IconCancel from '@material-ui/icons/Cancel';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';


function AddressQuickCreateButton({ onChange }) {
    const [showDialog, setShowDialog] = useState(false);
    const [create, { loading }] = useCreate('address');
    const notify = useNotify();
    const form = useForm();

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
                    form.change('address_id', data.id);
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
            <Button onClick={handleClick} label="ra.action.create">
                <IconContentAdd />
            </Button>
            <Dialog
                fullWidth
                open={showDialog}
                onClose={handleCloseClick}
                aria-label="Create Address"
            >
                <DialogTitle>Create address</DialogTitle>
                <FormWithRedirect
                    resource="address"
                    save={handleSubmit}
                    render={({
                            handleSubmitWithRedirect,
                            pristine,
                            saving
                    }) => (
                        <>
                            <DialogContent>
                                <TextInput
                                    source="line_1"
                                    validate={required()}
                                    fullWidth
                                />
                                <TextInput
                                    source="line_2"
                                    validate={required()}
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

export default AddressQuickCreateButton;
