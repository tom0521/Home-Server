import * as React from "react";
import {
	Create,
    DateTimeInput,
    ReferenceInput,
    required,
    SelectInput,
	SimpleForm,
	TextInput
} from 'react-admin';
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

export const TransferCreate = props => (
	<Create {...props}>
		<SimpleForm redirect="/account" validate={validateTransfer}>
            <DateTimeInput source="timestamp" />
            <ReferenceInput source="from_account_id" reference="account">
                <SelectInput validate={required()} optionText={
                        choice => `${choice.name} (${MoneyFormat(2)(choice.balance)})`
                    }
                />
            </ReferenceInput>
            <ReferenceInput source="to_account_id" reference="account">
                <SelectInput validate={required()} optionText={
                        choice => `${choice.name} (${MoneyFormat(2)(choice.balance)})`
                    }
                />
            </ReferenceInput>
			<TextInput validate={required()} source="amount" />
            <SelectInput source="category" choices={categories} optionValue="name" />
		</SimpleForm>
	</Create>
);
