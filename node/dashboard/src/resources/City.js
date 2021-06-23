import * as React from "react";
import {
	Create,
	Datagrid,
	Edit,
	List,
	ReferenceField,
	ReferenceInput,
	SelectInput,
	SimpleForm,
	TextField,
	TextInput
} from 'react-admin';

export const CityCreate = props => (
	<Create {...props}>
		<SimpleForm redirect="/city">
			<TextInput source="name" />
			<ReferenceInput source="state_province_id" reference="state_province">
				<SelectInput optionText="name" />
			</ReferenceInput>
		</SimpleForm>
	</Create>
);

export const CityEdit = props => (
	<Edit {...props}>
		<SimpleForm>
			<TextInput source="name" />
			<ReferenceInput source="state_province_id" reference="state_province">
				<SelectInput optionText="name" />
			</ReferenceInput>
		</SimpleForm>
	</Edit>
);

export const CityList = props => (
	<List {...props}>
		<Datagrid rowClick="edit">
			<TextField source="id" />
			<TextField source="name" />
			<ReferenceField source="state_province_id" reference="state_province">
				<TextField source="name" />
			</ReferenceField>
		</Datagrid>
	</List>
);
