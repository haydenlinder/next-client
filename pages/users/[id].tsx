import type { NextPage } from "next";
import {
    GetUserByIdQuery, GetUserByIdQueryVariables,
} from "../../types/generated/graphql";
import { ApolloQueryResult, useQuery, useReactiveVar } from "@apollo/client";
import { currentUserIdState } from "../../token";
import { GET_USER_BY_ID } from "../../graphql/users";
import { useRouter } from "next/router";

type Params = { id: string }


const Home: NextPage<ApolloQueryResult<GetUserByIdQuery>> = () => {
    const { query } = useRouter()

    const { data, error, loading } = useQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GET_USER_BY_ID, {
        variables: {
            _eq: Number(query.id)
        }
    });

    if (error) {
        console.log({ error })
        return <div>{error.message}</div>
    }

    if (loading) return <div>Loading</div>

    const user = data?.users_connection.edges[0]?.node

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
