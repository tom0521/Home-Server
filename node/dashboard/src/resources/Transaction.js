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

export const PlaceCreate = props => (
	<Create {...props}>
		<SimpleForm>
			<TextInput source="place" />
		</SimpleForm>
	</Create>
);

export const PlaceEdit = props => (
	<Edit {...props}>
		<SimpleForm>
			<TextInput source="place" />
		</SimpleForm>
	</Edit>
);

export const PlaceList = props => (
	<List {...props}>
		<Datagrid rowClick="edit">
			<TextField source="id" />
			<TextField source="place" />
		</Datagrid>
	</List>
);
