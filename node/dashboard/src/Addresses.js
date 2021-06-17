import * as React from "react";
import {
	Create,
	Datagrid,
	Edit,
	List,
	NumberInput,
	ReferenceInput,
	SelectInput,
	SimpleForm,
	TextField,
	TextInput,
	UrlField
} from 'react-admin';

export const AddressCreate = props => (
	<Create {...props}>
		<SimpleForm>
			<ReferenceInput source="place_id" reference="place">
				<SelectInput optionText="place" />
			</ReferenceInput>
			<TextInput source="address" />
			<TextInput source="address2" />
			<ReferenceInput source="city_id" reference="city">
				<SelectInput optionText="city" />
			</ReferenceInput>
			<NumberInput source="postal_code" />
			<TextInput source="phone" />
			<TextInput source="url" type="url" />
		</SimpleForm>
	</Create>
);

export const AddressEdit = props => (
	<Edit {...props}>
		<SimpleForm>
			<ReferenceInput source="place_id" reference="place">
				<SelectInput optionText="place" />
			</ReferenceInput>
			<TextInput source="address" />
			<TextInput source="address2" />
			<ReferenceInput source="city_id" reference="city">
				<SelectInput optionText="city" />
			</ReferenceInput>
			<NumberInput source="postal_code" />
			<TextInput source="phone" />
			<TextInput source="url" type="url" />
		</SimpleForm>
	</Edit>
);

export const AddressList = props => (
	<List {...props}>
		<Datagrid rowClick="edit">
			<TextField source="id" />
			<TextField source="place_id" />
			<TextField source="address" />
			<TextField source="address2" />
			<TextField source="city_id" />
			<TextField source="postal_code" />
			<TextField source="phone" />
			<UrlField source="url" />
		</Datagrid>
	</List>
);
