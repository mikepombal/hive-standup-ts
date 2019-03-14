// tslint:disable
// this is an auto generated file. This will be overwritten

export const createTask = `mutation CreateTask($input: CreateTaskInput!) {
  createTask(input: $input) {
    id
    title
    description
    status
  }
}
`;
export const updateTask = `mutation UpdateTask($input: UpdateTaskInput!) {
  updateTask(input: $input) {
    id
    title
    description
    status
  }
}
`;
export const deleteTask = `mutation DeleteTask($input: DeleteTaskInput!) {
  deleteTask(input: $input) {
    id
    title
    description
    status
  }
}
`;
export const createPrivateNote = `mutation CreatePrivateNote($input: CreatePrivateNoteInput!) {
  createPrivateNote(input: $input) {
    id
    content
  }
}
`;
export const updatePrivateNote = `mutation UpdatePrivateNote($input: UpdatePrivateNoteInput!) {
  updatePrivateNote(input: $input) {
    id
    content
  }
}
`;
export const deletePrivateNote = `mutation DeletePrivateNote($input: DeletePrivateNoteInput!) {
  deletePrivateNote(input: $input) {
    id
    content
  }
}
`;
export const createPerson = `mutation CreatePerson($input: CreatePersonInput!) {
  createPerson(input: $input) {
    id
    username
    name
    surname
    active
  }
}
`;
export const updatePerson = `mutation UpdatePerson($input: UpdatePersonInput!) {
  updatePerson(input: $input) {
    id
    username
    name
    surname
    active
  }
}
`;
export const deletePerson = `mutation DeletePerson($input: DeletePersonInput!) {
  deletePerson(input: $input) {
    id
    username
    name
    surname
    active
  }
}
`;
