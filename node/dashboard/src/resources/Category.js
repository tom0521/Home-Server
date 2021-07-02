import * as React from "react";
import {
	Create,
	Datagrid,
	Edit,
    Filter,
	List,
	SimpleForm,
	TextField,
	TextInput
} from 'react-admin';

export const CategoryCreate = props => (
	<Create {...props}>
		<SimpleForm redirect="/category">
			<TextInput source="name" />
		</SimpleForm>
	</Create>
);

export const CategoryEdit = props => (
	<Edit {...props}>
		<SimpleForm>
			<TextInput source="name" />
		</SimpleForm>
	</Edit>
);

export const CategoryFilter = props => (
    <Filter {...props}>
        <TextInput label="Search" source="name" alwaysOn />
    </Filter>
);

export const CategoryList = props => (
	<List filters={<CategoryFilter />} {...props}>
		<Datagrid rowClick="edit">
			<TextField source="id" />
			<TextField source="name" />
		</Datagrid>
	</List>
);
