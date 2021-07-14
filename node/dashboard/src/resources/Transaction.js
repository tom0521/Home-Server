import * as React from "react";
import {
	Create,
	Datagrid,
	DateField,
	DateTimeInput,
	Edit,
    Filter,
    FormDataConsumer,
    ImageInput,
    ImageField,
	List,
	NumberField,
	NumberInput,
	ReferenceInput,
	SelectInput,
	SimpleForm,
	TextField,
	TextInput,
    UrlField,
} from 'react-admin';
import AddressReferenceInput from '../components/AddressReferenceInput'
import TagsInput from '../components/TagsInput';

export const TransactionCreate = props => (
	<Create {...props}>
		<SimpleForm redirect="/transaction/create">
			<DateTimeInput source="timestamp" />
			<NumberInput source="amount" step="0.01" />
			<ReferenceInput source="account_id" reference="account">
				<SelectInput optionText={choice => `${choice.name} - $${choice.balance}`} />
			</ReferenceInput>
            <ReferenceInput source="place_id" reference="place">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <FormDataConsumer>
                {({ formData, ...rest }) => (
                    <AddressReferenceInput
                        source="address_id"
                        reference="address"
                        filter={ formData.place_id ? { place_id: formData.place_id } : {} }
                        allowEmpty
                        disabled={ !formData.place_id }
                        {...rest}
                    />
                )}
            </FormDataConsumer>
            <TextInput source="category" />
			{
			// TODO; Add SelectArrayInput for tags
			// TODO: Add ImageInput for receipt
			}
            <ImageInput source="receipt" label="Receipt" accept="image/*" placeholder={<p>Drop your receipt here</p>}>
                <ImageField source="src" title="title" />
            </ImageInput>
			<TextInput multiline source="note" />
            <TagsInput name="tags" />
		</SimpleForm>
	</Create>
);

export const TransactionEdit = props => (
	<Edit {...props}>
		<SimpleForm>
			<DateTimeInput source="timestamp" />
			<NumberInput source="amount" step="0.01" />
			<ReferenceInput source="account_id" reference="account">
				<SelectInput optionText={choice => `${choice.name} - $${choice.balance}`} />
			</ReferenceInput>
			<ReferenceInput source="address_id" reference="address">
				{
				// TODO: Add the entire address
				}
				<SelectInput optionText="line_1" />
			</ReferenceInput>
            <TextInput source="category" />
			{
			// TODO; Add SelectArrayInput for tags
			// TODO: Add ImageInput for receipt
			}
			<TextInput multiline source="note" />
		</SimpleForm>
	</Edit>
);

export const TransactionFilter = props => (
    <Filter {...props}>
    </Filter>
);

export const TransactionList = props => (
	<List filters={<TransactionFilter />} {...props}>
		<Datagrid rowClick="edit">
			<DateField source="timestamp" />
			<NumberField source="amount" step="0.01" />
			<TextField source="category" />
			<TextField multiline source="note" />
            <UrlField source="receipt" />
		</Datagrid>
	</List>
);
