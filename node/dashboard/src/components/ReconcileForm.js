import React, { useState } from 'react';
import {
    DateInput,
    ReferenceInput,
    required,
    SelectInput,
    TextInput,
    useDataProvider,
} from 'react-admin';
import { Form } from 'react-final-form';


const ReconcileForm = ({ onChange, ...props}) => {
    const dataProvider = useDataProvider();
    const [ step, setStep ] = useState(0);
    const [ values, setValues ] = useState({});

    const verifyReconcile = (account) => {
        setValues(Object.assign({}, account, { 'option': 0 }));
        dataProvider.getDefault(`account/${account.id}/reconcile`,Object.assign({}, account, { 'choice': 0 }))
                    .then(response => {
                        if (response.total === 1) {
                            setStep(1);
                        }
                    });
    };
    const submitReconcile = (payment) => {
        // No need to set values. Just use them, submit and close
        setValues(Object.assign({}, values, payment));
        dataProvider.postDefault(`account/${values.id}/reconcile`,Object.assign({}, values, payment))
                    .then(response => {
                        setStep(2);
                    });
    };

    switch (step) {
        case 0:
            return (
                <Form onSubmit={verifyReconcile}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <ReferenceInput
                                source="id"
                                reference="account"
                                fullWidth
                            >
                                <SelectInput
                                    validate={required()}
                                    optionText="name"
                                />
                            </ReferenceInput>
                            <DateInput
                                source="end_date"
                                fullWidth
                            />
                            <TextInput
                                source="amount"
                                validate={required()}
                                fullWidth
                            />
                            <input type="submit" />
                        </form>
                    )}
                />
            );
        case 1:
            return (
                <Form onSubmit={submitReconcile}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <ReferenceInput
                                source="account_id"
                                reference="account"
                                fullWidth
                            >
                                <SelectInput
                                    validate={required()}
                                    optionText="name"
                                />
                            </ReferenceInput>
                            <DateInput
                                source="payment_date"
                                validate={required()}
                                fullWidth
                            />
                            <input type="submit" />
                        </form>
                    )}
                />
            );
        default:
            // do nothing
            return (
                <p> All Set! </p>
            );
    }
}

export default ReconcileForm;
