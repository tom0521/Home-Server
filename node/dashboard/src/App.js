import * as React from "react";
import { Admin, Resource } from 'react-admin';

import dataProvider from './DataProvider';

import { AccountCreate, AccountEdit, AccountList } from './resources/Account';
import { AddressCreate, AddressEdit, AddressList } from './resources/Address';
import { CategoryCreate, CategoryEdit, CategoryList } from './resources/Category';
import { CityCreate, CityEdit, CityList } from './resources/City';
import { PlaceCreate, PlaceEdit, PlaceList } from './resources/Place';
import { TagCreate, TagEdit, TagList } from './resources/Tag';
import { TransactionCreate, TransactionEdit, TransactionList } from './resources/Transaction';

const App = () => (
    <Admin dataProvider={dataProvider}>
	<Resource name="account" list={AccountList} edit={AccountEdit} create={AccountCreate} />
	<Resource name="address" list={AddressList} edit={AddressEdit} create={AddressCreate} />
	<Resource name="category" list={CategoryList} edit={CategoryEdit} create={CategoryCreate} />
        <Resource name="city" list={CityList} edit={CityEdit} create={CityCreate} />
	<Resource name="place" list={PlaceList} edit={PlaceEdit} create={PlaceCreate} />
	<Resource name="tag" list={TagList} edit={TagEdit} create={TagCreate} />
	<Resource name="transaction" list={TransactionList} edit={TransactionEdit} create={TransactionCreate} />
    </Admin>
);

export default App;
