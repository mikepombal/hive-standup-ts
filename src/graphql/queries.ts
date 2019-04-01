// tslint:disable
// this is an auto generated file. This will be overwritten

export const getPerson = `query GetPerson($id: ID!) {
  getPerson(id: $id) {
    id
    username
    name
    surname
    active
  }
}
`;
export const listPersons = `query ListPersons(
  $filter: ModelPersonFilterInput
  $limit: Int
  $nextToken: String
) {
  listPersons(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      username
      name
      surname
      active
    }
    nextToken
  }
}
`;
