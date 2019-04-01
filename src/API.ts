/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type CreatePersonInput = {
  id?: string | null,
  username: string,
  name: string,
  surname: string,
  active: boolean,
};

export type UpdatePersonInput = {
  id: string,
  username?: string | null,
  name?: string | null,
  surname?: string | null,
  active?: boolean | null,
};

export type DeletePersonInput = {
  id?: string | null,
};

export type ModelPersonFilterInput = {
  id?: ModelIDFilterInput | null,
  username?: ModelStringFilterInput | null,
  name?: ModelStringFilterInput | null,
  surname?: ModelStringFilterInput | null,
  active?: ModelBooleanFilterInput | null,
  and?: Array< ModelPersonFilterInput | null > | null,
  or?: Array< ModelPersonFilterInput | null > | null,
  not?: ModelPersonFilterInput | null,
};

export type ModelIDFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelStringFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelBooleanFilterInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type CreatePersonMutationVariables = {
  input: CreatePersonInput,
};

export type CreatePersonMutation = {
  createPerson:  {
    __typename: "Person",
    id: string,
    username: string,
    name: string,
    surname: string,
    active: boolean,
  } | null,
};

export type UpdatePersonMutationVariables = {
  input: UpdatePersonInput,
};

export type UpdatePersonMutation = {
  updatePerson:  {
    __typename: "Person",
    id: string,
    username: string,
    name: string,
    surname: string,
    active: boolean,
  } | null,
};

export type DeletePersonMutationVariables = {
  input: DeletePersonInput,
};

export type DeletePersonMutation = {
  deletePerson:  {
    __typename: "Person",
    id: string,
    username: string,
    name: string,
    surname: string,
    active: boolean,
  } | null,
};

export type GetPersonQueryVariables = {
  id: string,
};

export type GetPersonQuery = {
  getPerson:  {
    __typename: "Person",
    id: string,
    username: string,
    name: string,
    surname: string,
    active: boolean,
  } | null,
};

export type ListPersonsQueryVariables = {
  filter?: ModelPersonFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPersonsQuery = {
  listPersons:  {
    __typename: "ModelPersonConnection",
    items:  Array< {
      __typename: "Person",
      id: string,
      username: string,
      name: string,
      surname: string,
      active: boolean,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type OnCreatePersonSubscription = {
  onCreatePerson:  {
    __typename: "Person",
    id: string,
    username: string,
    name: string,
    surname: string,
    active: boolean,
  } | null,
};

export type OnUpdatePersonSubscription = {
  onUpdatePerson:  {
    __typename: "Person",
    id: string,
    username: string,
    name: string,
    surname: string,
    active: boolean,
  } | null,
};

export type OnDeletePersonSubscription = {
  onDeletePerson:  {
    __typename: "Person",
    id: string,
    username: string,
    name: string,
    surname: string,
    active: boolean,
  } | null,
};
