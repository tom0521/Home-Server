import * as React from "react";
import {
	ChipField,
	Create,
	Datagrid,
    Edit,
    Filter,
	List,
	NumberField,
	RadioButtonGroupInput,
    required,
	SimpleForm,
	TextField,
	TextInput
} from 'react-admin';

export const AccountCreate = props => (
	<Create {...props}>
		<SimpleForm redirect="/account">
			<TextInput source="name" validate={required()} />
			<TextInput source="balance" />
			<RadioButtonGroupInput source="type" choices={[
				{ id: 'DEBIT', name: 'Debit' },
				{ id: 'CREDIT', name: 'Credit' }
			]} />
		</SimpleForm>
	</Create>
);

export const AccountEdit = props => (
	<Edit {...props}>
		<SimpleForm>
			<TextInput source="name" />
			<TextInput source="balance" />
			<RadioButtonGroupInput source="type" choices={[
				{ id: 'DEBIT', name: 'Debit' },
				{ id: 'CREDIT', name: 'Credit' }
			]} />
		</SimpleForm>
	</Edit>
);

export const AccountFilter = props => (
    <Filter {...props}>
        <TextInput label="Search" source="name" alwaysOn />
    </Filter>
);

export const AccountList = props => (
	<List filters={<AccountFilter />} {...props}>
		<Datagrid rowClick="edit">
			<TextField source="id" />
			<TextField source="name" />
			<NumberField source="balance" options={{ maximumFractionDigits: 2 }} />
			<ChipField source="type" />
		</Datagrid>
	</List>
);
