import React, { Component } from 'react';
import './App.css';
import Auth from '@aws-amplify/auth';
import Analytics from '@aws-amplify/analytics';
import { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

import awsconfig from './aws-exports';
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';

// retrieve temporary AWS credentials and sign requests
Auth.configure(awsconfig);
// send analytics events to Amazon Pinpoint
Analytics.configure(awsconfig);
API.configure(awsconfig);

interface Props {}
interface State {
    analyticsEventSent: boolean;
    eventsSent: number;
    resultHtml: JSX.Element;
}
class App extends Component<Props, State> {
    state = {
        analyticsEventSent: false,
        eventsSent: 0,
        resultHtml: <div />,
    };

    logout = () => {
        Auth.signOut()
            .then(data => console.log(data))
            .catch(err => console.log(err));
        console.log('Logged out');
    };

    handleAnalyticsClick = () => {
        console.log('handleAnalyticsClick');
        Analytics.record('Test Analytics').then(evt => {
            const url =
                'https://' +
                awsconfig.aws_project_region +
                '.console.aws.amazon.com/pinpoint/home/?region=' +
                awsconfig.aws_project_region +
                '#/apps/' +
                awsconfig.aws_mobile_analytics_app_id +
                '/analytics/events';
            let result = (
                <div>
                    <p>Event Submitted.</p>
                    <p>Events sent: {++this.state.eventsSent}</p>
                    <a href={url} target="_blank">
                        View Events on the Amazon Pinpoint Console
                    </a>
                </div>
            );
            this.setState({
                analyticsEventSent: true,
                eventsSent: this.state.eventsSent,
                resultHtml: result,
            });
        });
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

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>Standup!!!</p>
                </header>
                <div className="App-intro">
                    <button className="App-button" onClick={this.logout}>
                        Log out
                    </button>
                    <hr />
                    <button className="App-button" onClick={this.handleAnalyticsClick}>
                        Generate Analytics Event (test v2)
                    </button>
                    <div>{this.state.eventsSent}</div>
                    <div>{this.state.resultHtml}</div>
                    <hr />
                    <button className="App-button" onClick={this.getTasksList}>
                        Get list of tasks
                    </button>
                    <button className="App-button" onClick={this.createTask}>
                        Create task
                    </button>
                </div>
            </div>
        );
    }
}

export default withAuthenticator(App);
