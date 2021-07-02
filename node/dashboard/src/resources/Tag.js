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

export const TagCreate = props => (
	<Create {...props}>
		<SimpleForm redirect="/tag">
			<TextInput source="name" />
		</SimpleForm>
	</Create>
);

export const TagEdit = props => (
	<Edit {...props}>
		<SimpleForm>
			<TextInput source="name" />
		</SimpleForm>
	</Edit>
);

export const TagFilter = props => (
    <Filter {...props}>
        <TextInput label="Search" source="name" alwaysOn />
    </Filter>
);

export const TagList = props => (
	<List filters={<TagFilter />} {...props}>
		<Datagrid rowClick="edit">
			<TextField source="id" />
			<TextField source="name" />
		</Datagrid>
	</List>
);
