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
			<TextInput source="city" />
			<TextInput source="state_province" />
			<TextInput source="country" />
		</SimpleForm>
	</Create>
);

export const CityEdit = props => (
	<Edit {...props}>
		<SimpleForm>
			<TextInput source="city" />
			<TextInput source="state_province" />
			<TextInput source="country" />
		</SimpleForm>
	</Edit>
);

export const CityList = props => (
	<List {...props}>
		<Datagrid rowClick="edit">
			<TextField source="id" />
			<TextField source="city" />
			<TextField source="state_province" />
			<TextField source="country" />
		</Datagrid>
	</List>
);
