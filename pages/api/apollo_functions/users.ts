import { CREATE_USER, GET_USERS, GET_USER_BY_EMAIL, GET_USER_BY_ID } from "../../../graphql/users"
import { CreateUserMutation, CreateUserMutationVariables, GetUserByEmailQuery, GetUserByEmailQueryVariables, GetUserByIdQuery, GetUserByIdQueryVariables, GetUsersPaginatedQuery, GetUsersPaginatedQueryResult, VerifyUserMutation, VerifyUserMutationVariables } from "../../../types/generated/graphql"
import client, { serverClient } from "../apollo-client"

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

export const getUserByEmail = (email: string | undefined ) => {
    return serverClient.query<
    GetUserByEmailQuery,
    GetUserByEmailQueryVariables
        >({ query: GET_USER_BY_EMAIL, variables: { _eq: email }, context: { headers: { "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET } } });
}

export const createUser = async ({ email, password_hash }: CreateUserMutationVariables) => {
    return await serverClient.mutate<
    CreateUserMutation,
    CreateUserMutationVariables
>({ mutation: CREATE_USER, variables: { email, password_hash }, context: { headers: { "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET} } });
}

export const verifyUser = async ({ user_id }: VerifyUserMutationVariables) => {
    return await serverClient.mutate<
    VerifyUserMutation,
    VerifyUserMutationVariables
>({ mutation: CREATE_USER, variables: { user_id }, context: { headers: { "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET} } });
}