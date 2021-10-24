import React, { useState } from 'react';
import { Button } from 'react-admin';
import IconCancel from '@material-ui/icons/Cancel';
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
} from '@material-ui/core';

const PopupForm = props => {
    const {
        form,
        icon,
        title
    } = props;
    const [showDialog, setShowDialog] = useState(false);

    const handleClick = () => {
        setShowDialog(true);
    };

    const handleCloseClick = () => {
        setShowDialog(false);
    };

    return (
        <>
            <Button onClick={handleClick} label={title}
                disabled={props.disabled}>
                {icon}
            </Button>
            <Dialog
                fullWidth
                open={showDialog}
                onClose={handleCloseClick}
                aria-label="Reconcile Account"
            >
                <DialogTitle disableTypography>
                    <Box display="flex" alignItems="center">
                        <Box flexGrow={1}>{title}</Box>
                        <Box>
                            <Button
                                label="ra.action.cancel"
                                onClick={handleCloseClick}
                            >
                                <IconCancel />
                            </Button>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    { form }
                </DialogContent>
            </Dialog>
        </>
    );
}

export default PopupForm;
