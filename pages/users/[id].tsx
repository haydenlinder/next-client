import type { GetServerSideProps, NextPage } from "next";
import {
    GetUserByIdQuery,
} from "../../types/generated/graphql";
import { ApolloQueryResult } from "@apollo/client";
import { getUserById } from "../api/apollo_functions/users";

type Props = ApolloQueryResult < GetUserByIdQuery >
type Params = { id: string }

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({ req, res, params }) => {
    const props  = await getUserById(params?.id);

    return {
        props,
    };

};

const Home: NextPage<ApolloQueryResult<GetUserByIdQuery>> = ({ data, error }) => {
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
