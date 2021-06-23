import * as React from "react";
import {
	ChipField,
	Create,
	Datagrid,
	Edit,
	List,
	NumberField,
	NumberInput,
	RadioButtonGroupInput,
	SimpleForm,
	TextField,
	TextInput
} from 'react-admin';

export const AccountCreate = props => (
	<Create {...props}>
		<SimpleForm redirect="/account">
			<TextInput source="name" />
			<NumberInput source="balance" step="0.01" />
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
			<NumberInput source="balance" step="0.01" />
			<RadioButtonGroupInput source="type" choices={[
				{ id: 'DEBIT', name: 'Debit' },
				{ id: 'CREDIT', name: 'Credit' }
			]} />
		</SimpleForm>
	</Edit>
);

export const AccountList = props => (
	<List {...props}>
		<Datagrid rowClick="edit">
			<TextField source="id" />
			<TextField source="name" />
			<NumberField source="balance" options={{ maximumFractionDigits: 2 }} />
			<ChipField source="type" />
		</Datagrid>
	</List>
);
