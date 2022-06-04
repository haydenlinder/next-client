import { GET_USER_BY_EMAIL, GET_USER_BY_ID } from "../../../graphql/users"
import { GetUserByEmailQuery, GetUserByEmailQueryVariables, GetUserByIdQuery, GetUserByIdQueryVariables } from "../../../types/generated/graphql"
import client from "../apollo-client"

export const getUserById = async (id: string | undefined) => {
    return await client.query<
        GetUserByIdQuery,
        GetUserByIdQueryVariables
    >({ query: GET_USER_BY_ID, variables: { _eq: Number(id) } })
}

export const getUsers = async () => {
    return await client.query<
    GetUserByEmailQuery,
    GetUserByEmailQueryVariables
>({ query: GET_USER_BY_EMAIL, variables: { _eq: "test@test.com" } });
}