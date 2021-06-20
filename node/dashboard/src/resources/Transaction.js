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
	TextInput,
	useCreate,
	useCreateSuggestionContext
} from 'react-admin';

import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	TextField as MaterialTextField
} from '@material-ui/core';

export const TransactionCreate = props => (
	<Create {...props}>
		<SimpleForm redirect="/transaction/create">
			<DateTimeInput source="timestamp" />
			<NumberInput source="amount" step="0.01" />
			<ReferenceInput source="account_id" reference="account">
				<SelectInput optionText={choice => `${choice.account} - $${choice.balance}`} />
			</ReferenceInput>
			<ReferenceInput source="address_id" reference="address">
				{
				// TODO: Add the entire address
				}
				<SelectInput optionText="address" />
			</ReferenceInput>
			<ReferenceInput source="category_id" reference="category">
				<SelectInput create={<CreateCategory />} optionText="category" />
			</ReferenceInput>
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
				<SelectInput optionText={choice => `${choice.account} - $${choice.balance}`} />
			</ReferenceInput>
			<ReferenceInput source="address_id" reference="address">
				{
				// TODO: Add the entire address
				}
				<SelectInput optionText="address" />
			</ReferenceInput>
			<ReferenceInput source="category_id" reference="category">
				<SelectInput create={<CreateCategory />} optionText="category" />
			</ReferenceInput>
			{
			// TODO; Add SelectArrayInput for tags
			// TODO: Add ImageInput for receipt
			}
			<TextInput multiline source="note" />
		</SimpleForm>
	</Edit>
);

const CreateCategory = () => {
	const { filter, onCancel, onCreate } = useCreateSuggestionContext();
	const [value, setValue] = React.useState(filter || '');
	const [create] = useCreate('category');

	const handleSubmit = (event) => {
		event.preventDefault();
		create(
			{
				payload: {
					data: {
						category: value,
					},
				},
			},
			{
				onSuccess: ({ data}) => {
					setValue('');
					onCreate(data);
				},
			}
		);
	};

	return (
		<Dialog open onClose={onCancel}>
			<form onSubmit={handleSubmit}>
				<DialogContent>
					<MaterialTextField
						label="New Category"
						value={value}
						onChange={event => setValue(event.target.value)}
						autofocus
					/>
				</DialogContent>
				<DialogActions>
					<Button type="submit">Save</Button>
					<Button onClick={onCancel}>Cancel</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

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
			<ReferenceField source="category_id" reference="category">
				<TextField source="category" />
			</ReferenceField>
			<TextField multiline source="note" />
		</Datagrid>
	</List>
);
