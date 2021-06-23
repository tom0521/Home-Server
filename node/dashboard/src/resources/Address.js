import * as React from "react";
import {
	Create,
	Datagrid,
	Edit,
	List,
	NumberInput,
	ReferenceField,
	ReferenceInput,
	SelectInput,
	SimpleForm,
	TextField,
	TextInput,
	UrlField
} from 'react-admin';

export const AddressCreate = props => (
	<Create {...props}>
		<SimpleForm redirect="/address">
			<ReferenceInput source="place_id" reference="place">
				<SelectInput optionText="name" />
			</ReferenceInput>
			<TextInput source="line_1" />
			<TextInput source="line_2" />
			<ReferenceInput source="city_id" reference="city">
				<SelectInput optionText="name" />
			</ReferenceInput>
			{
			// TODO: Custom input for these three
			}
			<NumberInput source="postal_code" min="0" max="99999" step="1" />
			<TextInput source="phone" />
			<TextInput source="url" type="url" />
		</SimpleForm>
	</Create>
);

export const AddressEdit = props => (
	<Edit {...props}>
		<SimpleForm>
			<ReferenceInput source="place_id" reference="place">
				<SelectInput optionText="name" />
			</ReferenceInput>
			<TextInput source="line_1" />
			<TextInput source="line_2" />
			<ReferenceInput source="city_id" reference="city">
				<SelectInput optionText="name" />
			</ReferenceInput>
			{
			// TODO: Custom input for these three
			}
			<NumberInput source="postal_code" min="0" max="99999" step="1" />
			<TextInput source="phone" />
			<TextInput source="url" type="url" />
		</SimpleForm>
	</Edit>
);

export const AddressList = props => (
	<List {...props}>
		<Datagrid rowClick="edit">
			<TextField source="id" />
			<ReferenceField source="place_id" reference="place">
				<TextField source="name" />
			</ReferenceField>
			{
			// TODO: Custom field to combine address
			}
			<TextField source="line_1" />
			<TextField source="line_2" />
			<ReferenceField source="city_id" reference="city">
				<TextField source="city" />
			</ReferenceField>
			{
			// TODO: Custom fields for these three?
			}
			<TextField source="postal_code" />
			<TextField source="phone" />
			<UrlField source="url" />
		</Datagrid>
	</List>
);
