import React, { useContext } from "react";
import { useQueryWithStore, Loading, Error } from 'react-admin';
import { Decimal } from 'decimal.js';
import Title from './Title';
import DateContext from '../util/DateContext';
import MoneyFormat from '../util/MoneyFormat';


const TagAverage = props => { 
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
                tags[tag.name] = {
                    total: new Decimal(0),
                    count: 0,
                };
            }
            tags[tag.name].total = tags[tag.name].total.minus(elem.amount);
            tags[tag.name].count++;
        });
    });

    const listData = Object.entries(tags)
                        .map(([key, val]) => {
                            return {
                                name: key,
                                amount: val.total.div(val.count).toNumber(),
                            };
                        })
                        .sort((v1, v2) => {
                            return v2.amount - v1.amount;
                        });

    const items = [];
    for (let i = 0; i < 10 && i < listData.length; ++i) {
        items.push(
            <li>{listData[i].name} - {MoneyFormat(2)(listData[i].amount)}</li>
        )
    };
    return (
        <React.Fragment>
            <Title>Top Average Tag</Title>
            <ol>
                {items}
            </ol>
        </React.Fragment>
    );
};

export default TagAverage;
