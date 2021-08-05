import * as React from "react";
import { Admin, Resource } from 'react-admin';

import AccountIcon from '@material-ui/icons/AccountBalance';
import AddressIcon from '@material-ui/icons/Place';
import PlaceIcon from '@material-ui/icons/Home';
import TransactionIcon from '@material-ui/icons/AttachMoney';

import dashboard from './Dashboard';
import dataProvider from './DataProvider';

import { AccountCreate, AccountEdit, AccountList } from './resources/Account';
import { AddressCreate, AddressEdit, AddressList } from './resources/Address';
import { PlaceCreate, PlaceEdit, PlaceList } from './resources/Place';
import { TransactionCreate, TransactionEdit, TransactionList } from './resources/Transaction';

const App = () => (
    <Admin dashboard={dashboard} dataProvider={dataProvider}>
	<Resource name="account" list={AccountList} edit={AccountEdit} create={AccountCreate} icon={AccountIcon} />
	<Resource name="address" list={AddressList} edit={AddressEdit} create={AddressCreate} icon={AddressIcon} />
	<Resource name="place" list={PlaceList} edit={PlaceEdit} create={PlaceCreate} icon={PlaceIcon} />
	<Resource name="transaction" list={TransactionList} edit={TransactionEdit} create={TransactionCreate} icon={TransactionIcon} />
    </Admin>
);

export default App;
