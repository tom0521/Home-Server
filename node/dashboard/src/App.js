import * as React from "react";
import { Admin, Resource, ListGuesser } from 'react-admin';
import dataProvider from './DataProvider';

const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="transaction" list={ListGuesser} />
    </Admin>
);

export default App;
