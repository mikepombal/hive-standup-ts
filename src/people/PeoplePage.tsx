import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';
import { Box, Button, CheckBox, Form, FormField, DataTable, Heading, Layer, Text, TextInput } from 'grommet';
import { Checkmark, Close, Edit, List } from 'grommet-icons';

import * as queries from '../graphql/queries';
import * as subscriptions from '../graphql/subscriptions';
import { ListPersonsQuery, GetPersonQuery } from '../API';
import { createPerson, updatePerson } from '../graphql/mutations';

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
        console.log('Update me');
        const result = await API.graphql(graphqlOperation(updatePerson, { input: person }));
        // @ts-ignore
        if (!result.error) {
            this.onClose();
        }
    };

    createPersonData = async (person: Person) => {
        console.log('Create Person Data', person);
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
                <Connect
                    query={graphqlOperation(queries.listPersons)}
                    subscription={graphqlOperation(subscriptions.onUpdatePerson)}
                    // @ts-ignore
                    onSubscriptionMsg={(prev, { onUpdatePerson }: { onUpdatePerson: Person }) => {
                        console.log('Subscription data:', prev, onUpdatePerson);
                        return {
                            ...prev,
                            listPersons: {
                                ...prev.listPersons,
                                items: prev.listPersons.items.map((p: Person) =>
                                    p.id === onUpdatePerson.id ? onUpdatePerson : p
                                ),
                            },
                        };
                    }}
                >
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
                                              id: item.id,
                                              username: item.username,
                                              name: item.name,
                                              surname: item.surname,
                                              active: item.active,
                                          },
                                      ]
                                    : acc,
                            []
                        );
                        return <DataTable columns={this.columns} data={list} size="medium" />;
                    }}
                </Connect>
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
