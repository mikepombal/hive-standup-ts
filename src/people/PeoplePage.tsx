import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Box, Button, CheckBox, Form, FormField, DataTable, Heading, Layer, Text, TextInput } from 'grommet';
import { Checkmark, Close, Edit, List } from 'grommet-icons';

import * as queries from '../graphql/queries';
import * as subscriptions from '../graphql/subscriptions';
import { ListPersonsQuery, ListPersonsQueryVariables, GetPersonQuery, GetPersonQueryVariables } from '../API';
import { createPerson, updatePerson } from '../graphql/mutations';
import PeopleList from './PeopleList';

interface Person {
    id: string;
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

enum FormState {
    List,
    Edit,
    Create,
}

interface Props {}

interface State {
    formState: FormState;
    selectedPerson: Person | null;
}

export default class PeoplePage extends Component<Props, State> {
    state: State = {
        formState: FormState.List,
        selectedPerson: null,
    };

    columns = [
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
            render: (person: Person) => (person.active ? <Checkmark /> : null),
        },
        {
            property: 'id',
            header: 'Edit',
            render: (person: Person) => <Button icon={<Edit />} onClick={() => this.editPerson(person)} />,
        },
    ];

    updatePersonData = async (person: Person) => {
        const result = await API.graphql(graphqlOperation(updatePerson, { input: person }));
        // @ts-ignore
        if (!result.error) {
            this.onClose();
        }
    };

    createPersonData = async (person: Person) => {
        const result = await API.graphql(graphqlOperation(createPerson, { input: person }));
        // @ts-ignore
        if (!result.error) {
            this.onClose();
        }
    };

    editPerson = (person?: Person) => {
        if (person) {
            this.setState({ formState: FormState.Edit, selectedPerson: person });
        }
    };

    // @ts-ignore
    subscribeToPersonListChange = subscribeToMore => {
        subscribeToMore({
            document: gql(subscriptions.onCreatePerson),
            // @ts-ignore
            updateQuery: (prev, { subscriptionData }) => {
                console.log('Subscription data:', prev, { subscriptionData });
                if (!subscriptionData.data) return prev;
                const newPersonData = subscriptionData.data.onCreatePerson;
                return Object.assign({}, prev, {
                    listPersons: {
                        ...prev.listPersons,
                        items: [...prev.listPersons.items, newPersonData],
                    },
                });
            },
        });
        subscribeToMore({ document: gql(subscriptions.onUpdatePerson) });
    };

    addPerson = () => {
        this.setState({ formState: FormState.Create, selectedPerson: null });
    };

    onClose = () => {
        this.setState({ formState: FormState.List });
    };

    render() {
        const { formState, selectedPerson } = this.state;
        return (
            <Box gridArea="main" justify="center" align="center" background="accent-3">
                <Query<ListPersonsQuery, ListPersonsQueryVariables> query={gql(queries.listPersons)}>
                    {({ loading, data, error, subscribeToMore }) => {
                        if (loading) return <p>loading...</p>;
                        if (error) return <p>{error.message}</p>;
                        if (!data) return <p>No data</p>;

                        return (
                            <PeopleList
                                data={data}
                                editPerson={this.editPerson}
                                subscribeToMore={() => this.subscribeToPersonListChange(subscribeToMore)}
                            />
                        );
                    }}
                </Query>
                {(formState === FormState.Edit || formState === FormState.Create) && (
                    <Layer position="right" full="vertical" modal onClickOutside={this.onClose} onEsc={this.onClose}>
                        <Box fill="vertical" overflow="auto" width="medium" pad="medium">
                            <Box flex={false} direction="row" justify="between">
                                <Heading level="2" margin="none">
                                    Edit
                                </Heading>
                                <Button icon={<Close />} onClick={this.onClose} />
                            </Box>
                            <Form
                                value={selectedPerson || {}}
                                // @ts-ignore
                                onSubmit={({ value }) =>
                                    formState === FormState.Edit
                                        ? this.updatePersonData(value)
                                        : this.createPersonData(value)
                                }
                            >
                                <FormField label="GitHub Username" name="username" required />
                                <FormField label="Name" name="name" required />
                                <FormField label="Surname" name="surname" required />
                                // @ts-ignore
                                <FormField component={CheckBox} label="Active" name="active" />
                                <Box direction="row" justify="between" margin={{ top: 'medium' }}>
                                    <Button label="Cancel" onClick={this.onClose} />
                                    <Button
                                        type="submit"
                                        label={formState === FormState.Edit ? 'Update' : 'Create'}
                                        primary
                                    />
                                </Box>
                            </Form>
                        </Box>
                    </Layer>
                )}
                <Button label="Add new person" onClick={this.addPerson} />
            </Box>
        );
    }
}
