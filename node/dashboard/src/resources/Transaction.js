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
	ReferenceInput,
	SelectInput,
	SimpleForm,
	TextField,
	TextInput,
} from 'react-admin';

export const TransactionCreate = props => (
	<Create {...props}>
		<SimpleForm redirect="/transaction/create">
			<DateTimeInput source="timestamp" />
			<NumberInput source="amount" step="0.01" />
			<ReferenceInput source="account_id" reference="account">
				<SelectInput optionText={choice => `${choice.name} - $${choice.balance}`} />
			</ReferenceInput>
			<ReferenceInput source="address_id" reference="address">
				{
				// TODO: Add the entire address
				}
				<SelectInput optionText="line_1" />
			</ReferenceInput>
            <TextInput source="category" />
			{
			// TODO; Add SelectArrayInput for tags
			// TODO: Add ImageInput for receipt
			}
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
				<SelectInput optionText={choice => `${choice.name} - $${choice.balance}`} />
			</ReferenceInput>
			<ReferenceInput source="address_id" reference="address">
				{
				// TODO: Add the entire address
				}
				<SelectInput optionText="line_1" />
			</ReferenceInput>
            <TextInput source="category" />
			{
			// TODO; Add SelectArrayInput for tags
			// TODO: Add ImageInput for receipt
			}
			<TextInput multiline source="note" />
		</SimpleForm>
	</Edit>
);

export const TransactionList = props => (
	<List {...props}>
		<Datagrid rowClick="edit">
			<DateField source="timestamp" />
			<NumberField source="amount" step="0.01" />
			<TextField source="category" />
			<TextField multiline source="note" />
		</Datagrid>
	</List>
);
