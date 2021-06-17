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

export const CategoryCreate = props => (
	<Create {...props}>
		<SimpleForm>
			<TextInput source="category" />
		</SimpleForm>
	</Create>
);

export const CategoryEdit = props => (
	<Edit {...props}>
		<SimpleForm>
			<TextInput source="category" />
		</SimpleForm>
	</Edit>
);

export const CategoryList = props => (
	<List {...props}>
		<Datagrid rowClick="edit">
			<TextField source="id" />
			<TextField source="category" />
		</Datagrid>
	</List>
);
