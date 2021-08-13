import * as React from "react";
import { Admin, Resource } from 'react-admin';

import AccountIcon from '@material-ui/icons/AccountBalance';
import TransactionIcon from '@material-ui/icons/AttachMoney';

import dashboard from './Dashboard';
import dataProvider from './DataProvider';

import { AccountCreate, AccountEdit, AccountList } from './resources/Account';
import { TransactionCreate, TransactionEdit, TransactionList } from './resources/Transaction';

const App = () => (
    <Admin dashboard={dashboard} dataProvider={dataProvider}>
	<Resource name="account" list={AccountList} edit={AccountEdit} create={AccountCreate} icon={AccountIcon} />
	<Resource name="address" />
	<Resource name="place" />
	<Resource name="transaction" list={TransactionList} edit={TransactionEdit} create={TransactionCreate} icon={TransactionIcon} />
    </Admin>
);

export default App;
