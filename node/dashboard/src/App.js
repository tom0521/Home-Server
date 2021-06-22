import * as React from "react";
import { Admin, Resource } from 'react-admin';

import AccountIcon from '@material-ui/icons/AccountBalance';
import AddressIcon from '@material-ui/icons/LocationOn';
import PlaceIcon from '@material-ui/icons/Home';
import CategoryIcon from '@material-ui/icons/Category';
import CityIcon from '@material-ui/icons/LocationCity';
import TagIcon from '@material-ui/icons/LocalOffer';
import TransactionIcon from '@material-ui/icons/AttachMoney';

import dashboard from './Dashboard';
import dataProvider from './DataProvider';

import { AccountCreate, AccountEdit, AccountList } from './resources/Account';
import { AddressCreate, AddressEdit, AddressList } from './resources/Address';
import { CategoryCreate, CategoryEdit, CategoryList } from './resources/Category';
import { CityCreate, CityEdit, CityList } from './resources/City';
import { CountryCreate, CountryEdit, CountryList } from './resources/Country';
import { PlaceCreate, PlaceEdit, PlaceList } from './resources/Place';
import { StateProvinceCreate, StateProvinceEdit, StateProvinceList } from './resources/StateProvince';
import { TagCreate, TagEdit, TagList } from './resources/Tag';
import { TransactionCreate, TransactionEdit, TransactionList } from './resources/Transaction';

const App = () => (
    <Admin dashboard={dashboard} dataProvider={dataProvider}>
	<Resource name="account" list={AccountList} edit={AccountEdit} create={AccountCreate} icon={AccountIcon} />
	<Resource name="address" list={AddressList} edit={AddressEdit} create={AddressCreate} icon={AddressIcon} />
	<Resource name="category" list={CategoryList} edit={CategoryEdit} create={CategoryCreate} icon={CategoryIcon} />
        <Resource name="city" list={CityList} edit={CityEdit} create={CityCreate} icon={CityIcon} />
	<Resource name="country" list={CountryList} edit={CountryEdit} create={CountryCreate} />
	<Resource name="place" list={PlaceList} edit={PlaceEdit} create={PlaceCreate} icon={PlaceIcon} />
	<Resource name="state_province" list={StateProvinceList} edit={StateProvinceEdit} create={StateProvinceCreate} />
	<Resource name="tag" list={TagList} edit={TagEdit} create={TagCreate} icon={TagIcon} />
	<Resource name="transaction" list={TransactionList} edit={TransactionEdit} create={TransactionCreate} icon={TransactionIcon} />
    </Admin>
);

export default App;
