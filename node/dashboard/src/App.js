import * as React from "react";
import { Admin, Resource } from 'react-admin';

import AccountIcon from '@material-ui/icons/AccountBalance';
import TransactionIcon from '@material-ui/icons/AttachMoney';
import TransferIcon from '@material-ui/icons/SwapHoriz';

import Dashboard from './Dashboard';
import dataProvider from './DataProvider';

import { AccountCreate, AccountEdit, AccountList } from './resources/Account';
import { TransactionCreate, TransactionEdit, TransactionList } from './resources/Transaction';
import { TransferCreate } from './resources/Transfer';

const App = () => (
    <Admin dashboard={Dashboard} dataProvider={dataProvider}>
	    <Resource name="account"
            list={AccountList} edit={AccountEdit} 
            create={AccountCreate} icon={AccountIcon} 
        />
	    <Resource name="address" />
	    <Resource name="place" />
	    <Resource name="transaction"
            list={TransactionList} edit={TransactionEdit}
            create={TransactionCreate} icon={TransactionIcon}
        />
        <Resource name="transfer"
            create={TransferCreate} icon={TransferIcon}
        />
    </Admin>
);

export default App;
