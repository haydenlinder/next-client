import type { GetServerSideProps, NextPage } from "next";
import { GET_USER_BY_ID } from "../../graphql/users";
import client from "../api/apollo-client";
import {
    GetUserByIdQuery,
    GetUserByIdQueryVariables,
} from "../../types/generated/graphql";
import { ApolloQueryResult } from "@apollo/client";

type Props = ApolloQueryResult < GetUserByIdQuery >
type Params = { id: string }

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({ req, res, params }) => {
    const props  = await client.query<
        GetUserByIdQuery,
        GetUserByIdQueryVariables
    >({ query: GET_USER_BY_ID, variables: { _eq: Number(params?.id) } });

    return {
        props,
    };

};

const Home: NextPage<ApolloQueryResult<GetUserByIdQuery>> = ({ data, error }) => {
    console.log(data)
    const user = data.users_connection.edges[0]?.node;
    if (!user) return <div>User Not Found</div>
    return (
        <section>
            <h1>username: {user.username}</h1>
            <div>email: {user.email}</div>
            <div>joined: {user.created_at}</div>
        </section>
    );
};

export default Home;
