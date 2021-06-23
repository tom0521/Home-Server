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

export const StateProvinceCreate = props => (
	<Create {...props}>
		<SimpleForm redirect="/state_province">
			<TextInput source="name" />
			<ReferenceInput source="country_id" reference="country">
				<SelectInput optionText="name" />
			</ReferenceInput>
		</SimpleForm>
	</Create>
);

export const StateProvinceEdit = props => (
	<Edit {...props}>
		<SimpleForm>
			<TextInput source="name" />
			<ReferenceInput source="country_id" reference="country">
				<SelectInput optionText="name" />
			</ReferenceInput>
		</SimpleForm>
	</Edit>
);

export const StateProvinceList = props => (
	<List {...props}>
		<Datagrid rowClick="edit">
			<TextField source="id" />
			<TextField source="name" />
			<ReferenceField source="country_id" reference="country">
				<TextField source="name" />
			</ReferenceField>
		</Datagrid>
	</List>
);
