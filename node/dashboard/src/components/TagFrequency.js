import React, { useContext } from "react";
import { useQueryWithStore, Loading, Error } from 'react-admin';
import Title from './Title';
import DateContext from '../util/DateContext';


const TagFrequency = props => { 
    const today = useContext(DateContext);
    const { loaded, error, data } = useQueryWithStore({
        type: 'getList',
        resource: 'transaction',
        payload: {
            pagination: {
                page: 1,
                perPage: 1000,
            },
            sort: {
                field: 'timestamp',
                order: 'ASC',
            },
            filter: {
                to_date: today,
            },
        }
    });
    if (!loaded) { return <Loading />; }
    if (error) { return <Error />; }

    const tags = {};
    data.forEach((elem) => {
        elem.tags.forEach((tag) => {
            if (!tags[tag.name]) {
                tags[tag.name] = 0;
            }
            tags[tag.name]++;
        });
    });

    const listData = Object.entries(tags)
                        .map(([key, val]) => {
                            return {
                                name: key,
                                amount: val,
                            };
                        })
                        .sort((v1, v2) => {
                            return v2.amount - v1.amount;
                        });

    const items = [];
    for (let i = 0; i < 10 && i < listData.length; ++i) {
        items.push(
            <li>{listData[i].name} - {listData[i].amount}</li>
        )
    };
    return (
        <React.Fragment>
            <Title>Top Tag Frequency</Title>
            <ol>
                {items}
            </ol>
        </React.Fragment>
    );
};

export default TagFrequency;
