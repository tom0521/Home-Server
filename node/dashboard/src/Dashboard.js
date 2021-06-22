import * as React from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Title } from 'react-admin';

const dashboard = () => (
	<Card>
		<Title title="This is the Dashboard" />
		<CardContent>This is where there would be text</CardContent>
	</Card>
);

export default dashboard;
