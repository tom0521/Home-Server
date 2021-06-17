import * as React from "react";
import { Admin, Resource } from 'react-admin';

import dataProvider from './DataProvider';
import { AddressCreate, AddressEdit, AddressList } from './Addresses';
import { PlaceCreate, PlaceEdit, PlaceList } from './Places';

const App = () => (
    <Admin dataProvider={dataProvider}>
	<Resource name="address" list={AddressList} edit={AddressEdit} create={AddressCreate} />
        <Resource name="place" list={PlaceList} edit={PlaceEdit} create={PlaceCreate} />
    </Admin>
);

export default App;
