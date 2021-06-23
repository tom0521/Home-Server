import * as React from "react";
import {
	Create,
	Datagrid,
	Edit,
	List,
	SimpleForm,
	TextField,
	TextInput
} from 'react-admin';

export const CountryCreate = props => (
	<Create {...props}>
		<SimpleForm redirect="/country">
			<TextInput source="name" />
		</SimpleForm>
	</Create>
);

export const CountryEdit = props => (
	<Edit {...props}>
		<SimpleForm>
			<TextInput source="name" />
		</SimpleForm>
	</Edit>
);

export const CountryList = props => (
	<List {...props}>
		<Datagrid rowClick="edit">
			<TextField source="id" />
			<TextField source="name" />
		</Datagrid>
	</List>
);
