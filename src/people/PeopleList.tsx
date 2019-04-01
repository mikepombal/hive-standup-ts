import React from 'react';
import { Button, DataTable } from 'grommet';
import { Checkmark, Edit } from 'grommet-icons';

import { ListPersonsQuery } from '../API';

interface Person {
    id: string;
    username: string;
    name: string;
    surname: string;
    active: boolean;
}

interface Props {
    data: ListPersonsQuery;
    editPerson: (person: Person) => void;
    subscribeToMore: () => void;
}

class PeopleList extends React.Component<Props> {
    componentDidMount() {
        this.props.subscribeToMore();
    }

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
            render: (person: Person) => <Button icon={<Edit />} onClick={() => this.props.editPerson(person)} />,
        },
    ];

    render() {
        const { listPersons } = this.props.data;
        const list = listPersons ? listPersons.items || [] : [];
        const listCleared = list.reduce(
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
        return <DataTable columns={this.columns} data={listCleared} size="medium" />;
    }
}

export default PeopleList;
