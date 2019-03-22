import React, { Component } from 'react';
import { Box, Button, Grid, Grommet, Text } from 'grommet';
import Auth from '@aws-amplify/auth';
import Analytics from '@aws-amplify/analytics';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

import awsconfig from './aws-exports';
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';

import PeoplePage from './people/PeoplePage';

// retrieve temporary AWS credentials and sign requests
Auth.configure(awsconfig);
// send analytics events to Amazon Pinpoint
Analytics.configure(awsconfig);
Amplify.configure(awsconfig);

const theme = {
    global: {
        font: {
            size: '14px',
            height: '20px',
        },
        colors: {
            brand: '#223843',
            'accent-1': '#72BDA3',
            'accent-2': '#476A6F',
            'accent-3': '#F9EDEA',
            'accent-4': '#C5C9A4',
        },
    },
};

interface Props {}
interface State {
    // analyticsEventSent: boolean;
    // eventsSent: number;
    // resultHtml: JSX.Element;
}
class App extends Component<Props, State> {
    state = {};

    logout = () => {
        Analytics.record('Test Analytics');
        Auth.signOut()
            .then(data => console.log(data))
            .catch(err => console.log(err));
        console.log('Logged out');
    };

    getTasksList = async () => {
        const allTasks = await API.graphql(graphqlOperation(queries.listTasks));
        console.log('Get the list of tasks', allTasks);
        const oneTask = await API.graphql(
            graphqlOperation(queries.getTask, { id: 'deb60986-4bcf-441b-b3c6-ef5af31a232a' })
        );
        console.log('Get the task', oneTask);
    };

    createTask = async () => {
        const task = {
            title: 'This task is for Alex',
            description: 'Steve gerard...',
        };
        const newTask = await API.graphql(graphqlOperation(mutations.createTask, { input: task }));
        console.log(newTask);
    };

    createPerson = async () => {
        const person = {
            username: 'mikepombal',
            name: 'Mickael',
            surname: 'Marques',
            active: true,
        };
        const newPerson = await API.graphql(graphqlOperation(mutations.createPerson, { input: person }));
        console.log(newPerson);
    };

    render() {
        return (
            <Grommet full theme={theme}>
                <Grid
                    fill
                    rows={['auto', 'flex']}
                    columns={['auto', 'flex']}
                    areas={[
                        { name: 'header', start: [0, 0], end: [1, 0] },
                        { name: 'sidebar', start: [0, 1], end: [0, 1] },
                        { name: 'main', start: [1, 1], end: [1, 1] },
                    ]}
                >
                    <Box
                        gridArea="header"
                        direction="row"
                        align="center"
                        justify="between"
                        pad={{ horizontal: 'medium', vertical: 'small' }}
                        background="brand"
                    >
                        <Text size="large">Standup</Text>
                        <Button label="Log out" onClick={this.logout} />
                    </Box>

                    <Box gridArea="sidebar" background="accent-2" width="small">
                        {[].map(name => (
                            <Button key={name} href="#" hoverIndicator>
                                <Box pad={{ horizontal: 'medium', vertical: 'small' }}>
                                    <Text>{name}</Text>
                                </Box>
                            </Button>
                        ))}
                    </Box>
                    <Box gridArea="main" justify="center" align="center" background="accent-3">
                        <PeoplePage />
                    </Box>
                </Grid>
            </Grommet>
        );
    }
}

export default withAuthenticator(App);
