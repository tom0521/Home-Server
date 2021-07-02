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

export const PlaceCreate = props => (
	<Create {...props}>
		<SimpleForm redirec="/place">
			<TextInput source="name" />
		</SimpleForm>
	</Create>
);

export const PlaceEdit = props => (
	<Edit {...props}>
		<SimpleForm>
			<TextInput source="name" />
		</SimpleForm>
	</Edit>
);

export const PlaceFilter = props => (
    <Filter {...props}>
        <TextInput label="Search" source="name" alwaysOn />
    </Filter>
);

export const PlaceList = props => (
	<List filters={<PlaceFilter />} {...props}>
		<Datagrid rowClick="edit">
			<TextField source="id" />
			<TextField source="name" />
		</Datagrid>
	</List>
);
