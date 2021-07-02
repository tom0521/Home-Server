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

export const StateProvinceCreate = props => (
	<Create {...props}>
		<SimpleForm redirect="/state_province">
			<TextInput source="name" />
		</SimpleForm>
	</Create>
);

export const StateProvinceEdit = props => (
	<Edit {...props}>
		<SimpleForm>
			<TextInput source="name" />
		</SimpleForm>
	</Edit>
);

export const StateProvinceFilter = props => (
    <Filter {...props}>
        <TextInput label="Search" source="name" alwaysOn />
    </Filter>
);

export const StateProvinceList = props => (
	<List filters={<StateProvinceFilter />} {...props}>
		<Datagrid rowClick="edit">
			<TextField source="id" />
			<TextField source="name" />
		</Datagrid>
	</List>
);
