import * as React from "react";
import {
	Create,
	Datagrid,
	Edit,
    Filter,
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
            <TextInput source="city" />
            <TextInput source="state_province" />
            <TextInput source="country" />
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
            <TextInput source="city" />
            <TextInput source="state_province" />
            <TextInput source="country" />
			{
			// TODO: Custom input for these three
			}
			<NumberInput source="postal_code" min="0" max="99999" step="1" />
			<TextInput source="phone" />
			<TextInput source="url" type="url" />
		</SimpleForm>
	</Edit>
);

export const AddressFilter = props => (
    <Filter {...props}>
        <TextInput label="Search" source="line_1" alwaysOn />
    </Filter>
);

export const AddressList = props => (
	<List filters={<AddressFilter />} {...props}>
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
			<TextField source="city" />
			<TextField source="state_province" />
			<TextField source="country" />
			{
			// TODO: Custom fields for these three?
			}
			<TextField source="postal_code" />
			<TextField source="phone" />
			<UrlField source="url" />
		</Datagrid>
	</List>
);
