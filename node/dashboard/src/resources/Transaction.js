import * as React from "react";
import {
	Create,
	Datagrid,
	DateField,
	DateTimeInput,
	Edit,
	List,
	NumberField,
	NumberInput,
	ReferenceField,
	ReferenceInput,
	SelectInput,
	SimpleForm,
	TextField,
	TextInput
} from 'react-admin';

export const TransactionCreate = props => (
	<Create {...props}>
		<SimpleForm>
			<DateTimeInput source="timestamp" />
			<NumberInput source="amount" step="0.01" />
			<ReferenceInput source="account_id" reference="account">
				{
				// TODO: Add the balance
				}
				<SelectInput optionText="account" />
			</ReferenceInput>
			<ReferenceInput source="address_id" reference="address">
				{
				// TODO: Add the entire address
				}
				<SelectInput optionText="address" />
			</ReferenceInput>
			<ReferenceInput source="category_id" reference="category">
				<SelectInput optionText="category" />
			</ReferenceInput>
			<TextInput multiline source="note" />
		</SimpleForm>
	</Create>
);

export const TransactionEdit = props => (
	<Edit {...props}>
		<SimpleForm>
			<DateTimeInput source="timestamp" />
			<NumberInput source="amount" step="0.01" />
			<ReferenceInput source="account_id" reference="account">
				{
				// TODO: Add the balance
				}
				<SelectInput optionText="account" />
			</ReferenceInput>
			<ReferenceInput source="address_id" reference="address">
				{
				// TODO: Add the entire address
				}
				<SelectInput optionText="address" />
			</ReferenceInput>
			<ReferenceInput source="category_id" reference="category">
				<SelectInput optionText="category" />
			</ReferenceInput>
			<TextInput multiline source="note" />
		</SimpleForm>
	</Edit>
);

export const TransactionList = props => (
	<List {...props}>
		<Datagrid rowClick="edit">
			<DateField source="timestamp" />
			<NumberField source="amount" step="0.01" />
			<ReferenceField source="account_id" reference="account">
				{
				// TODO: Add the balance
				}
				<TextField source="account" />
			</ReferenceField>
			<ReferenceField source="address_id" reference="address">
				{
				// TODO: Add the entire address
				}
				<TextField source="address" />
			</ReferenceField>
			<ReferenceField source="category_id" reference="category">
				<TextField source="category" />
			</ReferenceField>
			<TextField multiline source="note" />
		</Datagrid>
	</List>
);
