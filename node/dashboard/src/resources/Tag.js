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

export const TagCreate = props => (
	<Create {...props}>
		<SimpleForm>
			<TextInput source="tag" />
		</SimpleForm>
	</Create>
);

export const TagEdit = props => (
	<Edit {...props}>
		<SimpleForm>
			<TextInput source="tag" />
		</SimpleForm>
	</Edit>
);

export const TagList = props => (
	<List {...props}>
		<Datagrid rowClick="edit">
			<TextField source="id" />
			<TextField source="tag" />
		</Datagrid>
	</List>
);
