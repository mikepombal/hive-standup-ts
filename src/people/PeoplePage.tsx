import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';
import { Box, Button, DataTable, Grid, Grommet, Text } from 'grommet';
import { Checkmark } from 'grommet-icons';

import * as queries from '../graphql/queries';
import { ListPersonsQuery } from '../API';
// import { createPerson } from '../graphql/mutations';

interface Person {
    username: string;
    name: string;
    surname: string;
    active: boolean;
}

interface ListPersonsQueryType {
    data: ListPersonsQuery;
    loading: boolean;
    error: Array<Error>;
}

const columns = [
    {
        property: 'name',
        header: 'Name',
    },
    {
        property: 'surname',
        header: 'Surname',
    },
    {
        property: 'username',
        header: 'GitHub',
    },
    {
        property: 'active',
        header: 'Is Active',
        render: (datum: Person) => (datum.active ? <Checkmark /> : null),
    },
];

interface Props {}

interface State {}

export default class PeoplePage extends Component<Props, State> {
    state = {};

    render() {
        return (
            <Box gridArea="main" justify="center" align="center" background="accent-3">
                <Connect query={graphqlOperation(queries.listPersons)}>
                    {({ data, loading, error }: ListPersonsQueryType) => {
                        if (error) return <h3>Error</h3>;
                        if (loading || !data.listPersons) return <h3>Loading...</h3>;

                        const ttt = data.listPersons.items || [];
                        const list = ttt.reduce(
                            (acc: Array<Person>, item) =>
                                item
                                    ? [
                                          ...acc,
                                          {
                                              username: item.username,
                                              name: item.name,
                                              surname: item.surname,
                                              active: item.active,
                                          },
                                      ]
                                    : acc,
                            []
                        );
                        return <DataTable columns={columns} data={list} size="medium" />;
                    }}
                </Connect>
            </Box>
        );
    }
}
