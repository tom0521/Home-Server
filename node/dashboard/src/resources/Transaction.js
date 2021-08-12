import * as React from "react";
import {
    AutocompleteInput,
	Create,
	Datagrid,
	DateField,
    DateInput,
	DateTimeInput,
	Edit,
    Filter,
    FormDataConsumer,
    ImageInput,
    ImageField,
	List,
	ReferenceInput,
    required,
	SelectInput,
	SimpleForm,
	TextInput,
    useCreate,
    useCreateSuggestionContext,
} from 'react-admin';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    TextField as MuiTextField,
} from '@material-ui/core';
import AddressReferenceInput from '../components/AddressReferenceInput';
import CategoryField from '../components/CategoryField';
import MoneyField from '../components/MoneyField';
import ReceiptField from '../components/ReceiptField';
import TagsInput from '../components/TagsInput';

const CreatePlace = () => {
    const { filter, onCancel, onCreate } = useCreateSuggestionContext();
    const [value, setValue] = React.useState(filter || '');
    const [create] = useCreate('place');

    const handleSubmit = (event) => {
        event.preventDefault();
        create(
            {
                payload: {
                    data: { name: value, },
                },
            },
            {
                onSuccess: ({ data }) => {
                    setValue('');
                    onCreate(data);
                },
            }
        );
    };

    return (
        <Dialog open onClose={onCancel}>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <MuiTextField
                        label="New Place"
                        value={value}
                        onChange={event => setValue(event.target.value)}
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit">Save</Button>
                    <Button onClick={onCancel}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const categories = [
    { id: 0,  name:'Housing' },
    { id: 1,  name: 'Transportation' },
    { id: 2,  name: 'Food' },
    { id: 3,  name: 'Utilities' },
    { id: 4,  name: 'Clothing' },
    { id: 5,  name: 'Medical/Healthcare' },
    { id: 6,  name: 'Insurance' },
    { id: 7,  name: 'Household Items/Supplies' },
    { id: 8,  name: 'Personal' },
    { id: 9,  name: 'Debt' },
    { id: 10, name: 'Retirement' },
    { id: 11, name: 'Education' },
    { id: 12, name: 'Savings' },
    { id: 13, name: 'Gifts/Donations' },
    { id: 14, name: 'Entertainment' },
    { id: 15, name: 'Income' }
];

export const TransactionCreate = props => (
	<Create {...props}>
		<SimpleForm redirect="/transaction/create">
			<DateTimeInput source="timestamp" />
			<TextInput source="amount" />
			<ReferenceInput source="account_id" reference="account" >
				<SelectInput optionText={choice => `${choice.name} - $${choice.balance}`} validate={required()} />
			</ReferenceInput>
            <ReferenceInput source="place_id" reference="place">
                <AutocompleteInput
                    optionText="name"
                    create={<CreatePlace />}
                    createLabel="New Place..."
                    allowEmpty
                />
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
            <SelectInput source="category" choices={categories} optionValue="name" />
			{
			// TODO; Add SelectArrayInput for tags
			// TODO: Add ImageInput for receipt
			}
            <ImageInput source="receipt" label="Receipt" accept="image/*" placeholder={<p>Drop your receipt here</p>}>
                <ImageField source="src" title="title" />
            </ImageInput>
			<TextInput multiline source="note" fullWidth />
            <TagsInput name="tags" fullWidth />
		</SimpleForm>
	</Create>
);

export const TransactionEdit = props => (
	<Edit {...props}>
		<SimpleForm>
			<DateTimeInput source="timestamp" />
			<TextInput source="amount" />
			<ReferenceInput source="account_id" reference="account" >
				<SelectInput optionText={choice => `${choice.name} - $${choice.balance}`} validate={required()} />
			</ReferenceInput>
            <SelectInput source="category" choices={categories} optionValue="name" />
			{
			// TODO; Add SelectArrayInput for tags
			// TODO: Add ImageInput for receipt
			}
			<TextInput multiline source="note" fullWidth />
		</SimpleForm>
	</Edit>
);

export const TransactionFilter = props => (
    <Filter {...props}>
        <ReferenceInput source="account_id" label="Account" reference="account">
            <SelectInput optionText="name" />
        </ReferenceInput>
        <DateInput source="from_date" label="From Date" />
        <DateInput source="to_date" label="To Date" />
    </Filter>
);

export const TransactionList = props => (
	<List filters={<TransactionFilter />} {...props}>
		<Datagrid rowClick="edit">
			<DateField source="timestamp" />
			<MoneyField source="amount" />
			<CategoryField source="category" />
            <ReceiptField source="receipt" />
		</Datagrid>
	</List>
);
