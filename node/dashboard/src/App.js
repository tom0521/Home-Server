import * as React from "react";
import { Admin, Resource } from 'react-admin';

import dataProvider from './DataProvider';

import { AccountCreate, AccountEdit, AccountList } from './resources/Account';
import { AddressCreate, AddressEdit, AddressList } from './resources/Address';
import { CategoryCreate, CategoryEdit, CategoryList } from './resources/Category';
import { CityCreate, CityEdit, CityList } from './resources/City';
import { PlaceCreate, PlaceEdit, PlaceList } from './resources/Place';

const App = () => (
    <Admin dataProvider={dataProvider}>
	<Resource name="account" list={AccountList} edit={AccountEdit} create={AccountCreate} />
	<Resource name="address" list={AddressList} edit={AddressEdit} create={AddressCreate} />
	<Resource name="category" list={CategoryList} edit={CategoryEdit} create={CategoryCreate} />
        <Resource name="city" list={CityList} edit={CityEdit} create={CityCreate} />
	<Resource name="place" list={PlaceList} edit={PlaceEdit} create={PlaceCreate} />
    </Admin>
);

export default App;
