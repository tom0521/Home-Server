import React, { cloneElement } from 'react';
import {
	ChipField,
	Create,
    CreateButton,
	Datagrid,
    Edit,
    ExportButton,
    Filter,
	List,
	RadioButtonGroupInput,
    required,
	SimpleForm,
	TextField,
	TextInput,
    TopToolbar,
} from 'react-admin';
import MoneyField from '../components/MoneyField';
import TransferQuickCreateButton from '../components/TransferQuickCreateButton';

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
	<List actions={<ListActions />} filters={<AccountFilter />} {...props}>
		<Datagrid rowClick="edit">
			<TextField source="name" />
			<MoneyField source="balance" />
			<ChipField source="type" />
		</Datagrid>
	</List>
);

const ListActions = (props) => (
    <TopToolbar>
        { cloneElement(props.filters, { context: 'button' }) }
        <CreateButton />
        <ExportButton />
        <TransferQuickCreateButton />
    </TopToolbar>
);
