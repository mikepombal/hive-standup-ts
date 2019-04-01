import React, { Component } from 'react';
import { Box, Button, Grid, Grommet, Text } from 'grommet';
import Auth from '@aws-amplify/auth';
import Analytics from '@aws-amplify/analytics';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import { ApolloProvider } from 'react-apollo';

import awsconfig from './aws-exports';
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';

import PeoplePage from './people/PeoplePage';

// retrieve temporary AWS credentials and sign requests
Auth.configure(awsconfig);
// send analytics events to Amazon Pinpoint
Analytics.configure(awsconfig);
Amplify.configure(awsconfig);

const client = new AWSAppSyncClient({
    url: awsconfig.aws_appsync_graphqlEndpoint,
    region: awsconfig.aws_appsync_region,
    auth: {
        type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
        jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken(),
    },
});

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

    render() {
        return (
            <ApolloProvider client={client}>
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
            </ApolloProvider>
        );
    }
}

export default withAuthenticator(App);
