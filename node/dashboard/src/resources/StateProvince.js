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
			<TextInput source="state_province" />
			<ReferenceInput source="country_id" reference="country">
				<SelectInput optionText="country" />
			</ReferenceInput>
		</SimpleForm>
	</Create>
);

export const StateProvinceEdit = props => (
	<Edit {...props}>
		<SimpleForm>
			<TextInput source="state_province" />
			<ReferenceInput source="country_id" reference="country">
				<SelectInput optionText="country" />
			</ReferenceInput>
		</SimpleForm>
	</Edit>
);

export const StateProvinceList = props => (
	<List {...props}>
		<Datagrid rowClick="edit">
			<TextField source="id" />
			<TextField source="state_province" />
			<ReferenceField source="country_id" reference="country">
				<TextField source="country" />
			</ReferenceField>
		</Datagrid>
	</List>
);
