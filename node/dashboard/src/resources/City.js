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

export const CityCreate = props => (
	<Create {...props}>
		<SimpleForm redirect="/city">
			<TextInput source="name" />
		</SimpleForm>
	</Create>
);

export const CityEdit = props => (
	<Edit {...props}>
		<SimpleForm>
			<TextInput source="name" />
		</SimpleForm>
	</Edit>
);

export const CityList = props => (
	<List {...props}>
		<Datagrid rowClick="edit">
			<TextField source="id" />
			<TextField source="name" />
		</Datagrid>
	</List>
);
