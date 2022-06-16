import { CREATE_USER, GET_USERS, GET_USER_BY_EMAIL, GET_USER_BY_ID } from "../../../graphql/users"
import { CreateUserMutation, CreateUserMutationVariables, GetUserByEmailQuery, GetUserByEmailQueryVariables, GetUserByIdQuery, GetUserByIdQueryVariables, GetUsersPaginatedQuery, GetUsersPaginatedQueryResult } from "../../../types/generated/graphql"
import client from "../apollo-client"

export const getUserById = async (id: string | undefined) => {
    return await client.query<
        GetUserByIdQuery,
        GetUserByIdQueryVariables
    >({ query: GET_USER_BY_ID, variables: { _eq: Number(id) } })
}

export const getUsers = async () => {
    return await client.query<
    GetUsersPaginatedQuery,
    GetUsersPaginatedQueryResult
        >({ query: GET_USERS });
}

export const getUserByEmail = (email: string | undefined, admin?: boolean) => {
    return client.query<
    GetUserByEmailQuery,
    GetUserByEmailQueryVariables
        >({ query: GET_USER_BY_EMAIL, variables: { _eq: email }, context: { headers: !admin ? undefined : { "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET } } });
}

export const createUser = async ({ email, password_hash }: CreateUserMutationVariables) => {
    return await client.mutate<
    CreateUserMutation,
    CreateUserMutationVariables
>({ mutation: CREATE_USER, variables: { email, password_hash }, context: { headers: { "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET} } });
}